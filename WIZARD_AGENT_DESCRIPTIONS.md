# Claude Code Sub-Agent Wizard Descriptions

Agent descriptions formatted for Claude Code sub-agent wizard to compare with our custom Iraqi AI agents.

## 🤖 Agent 1: Cultural Agent

**Wizard Description:**
```
Create a cultural validation agent for Iraqi AI chat system that validates all content for Iraqi cultural appropriateness, Islamic compliance, and political neutrality. The agent should filter sensitive political/sectarian content, ensure respect for Iraqi customs and family values, apply correct Iraqi professional honorifics (أستاذ، دكتور، مهندس), and validate business interactions against Iraqi social norms. It should handle cultural uncertainty by defaulting to formal/respectful language and maintain 95%+ cultural appropriateness detection with <200ms response time. The agent integrates with Sequential MCP for structured analysis and Context7 MCP for Iraqi cultural patterns.
```

**Key Capabilities Expected from Wizard:**
- Iraqi customs validation and etiquette checking
- Islamic values compliance and religious sensitivity
- Political neutrality and sectarian content filtering
- Professional Iraqi honorifics application
- Cultural appropriateness scoring and recommendations

---

## 🤖 Agent 2: Language Agent

**Wizard Description:**
```
Create an Arabic RTL text processing agent for Iraqi AI chat system that handles right-to-left text direction, Iraqi dialect recognition, and cross-language coordination. The agent should process Arabic text formatting with proper RTL layout, identify Iraqi-specific vocabulary and colloquialisms, manage font selection (font-arabic vs font-sans), handle Arabic-English mixed content with proper alignment, and extract cultural context from dialect patterns. It should achieve 99%+ RTL layout accuracy and 85%+ Iraqi dialect recognition with <100ms processing time. The agent integrates with Magic MCP for RTL UI components and Sequential MCP for complex text analysis.
```

**Key Capabilities Expected from Wizard:**
- RTL text direction processing and UI validation
- Iraqi dialect pattern recognition and analysis
- Arabic font and typography management
- Mixed Arabic-English content coordination
- Voice text processing with dialect confidence scoring

---

## 🤖 Agent 3: Professional Agent

**Wizard Description:**
```
Create a professional domain expertise agent for Iraqi AI chat system that provides Iraqi-specific knowledge across legal, medical, educational, and engineering domains without giving specific professional advice. The agent should classify queries by Iraqi professional context, handle legal (Iraqi civil law, commercial law), medical (Iraqi healthcare system), educational (Iraqi curriculum standards), and engineering (Iraqi building codes) domains with appropriate disclaimers. It should process Iraqi professional terminology in Arabic and English, maintain professional ethics compliance, and route voice commands to appropriate professional contexts. Target 90%+ domain classification accuracy with <300ms response time. The agent integrates with Context7 MCP for Iraqi professional standards and Sequential MCP for complex domain analysis.
```

**Key Capabilities Expected from Wizard:**
- Multi-domain professional classification (legal/medical/educational/engineering)
- Iraqi professional standards validation and compliance
- Professional terminology processing in Arabic and English
- Ethical boundaries and appropriate disclaimer generation
- Voice command professional context routing

---

## 🤖 Agent 4: Security Agent

**Wizard Description:**
```
Create a payment security and data protection agent for Iraqi AI chat system that handles secure integration with Iraqi payment gateways (ZainCash, FastPay, NassWallet), enforces 1-hour session data auto-expiry, and provides comprehensive input validation. The agent should validate payment transactions with fraud detection, encrypt sensitive data at rest and in transit, sanitize inputs while preserving Arabic text integrity, implement SQL injection and XSS protection, manage API credentials securely, and maintain audit logs without exposing sensitive information. It should achieve 100% payment security compliance and <150ms security validation time. The agent integrates with Sequential MCP for threat analysis and Playwright MCP for payment flow testing.
```

**Key Capabilities Expected from Wizard:**
- Iraqi payment gateway security validation and fraud detection
- Session management with 1-hour auto-expiry enforcement
- Input sanitization preserving Arabic text and Iraqi dialect
- PII protection and privacy compliance
- Security audit logging and credential management

---

## 🤖 Agent 5: Integration Agent

**Wizard Description:**
```
Create an external service coordination agent for Iraqi AI chat system that manages multi-gateway payment processing, credit system tracking, and service health monitoring. The agent should intelligently route payments between ZainCash, FastPay, and NassWallet based on amount, availability, and fees, handle automatic fallback between gateways, track user credit consumption and billing, manage external API rate limiting and authentication, coordinate Iraqi-specific service adaptations including currency conversion (IQD) and time zone handling (AST), and monitor service health with automated alerting. It should achieve 95%+ payment success rate and <250ms gateway selection time. The agent integrates with all MCP servers for comprehensive coordination.
```

**Key Capabilities Expected from Wizard:**
- Intelligent Iraqi payment gateway selection and routing
- Credit consumption tracking and automated billing
- External API coordination with rate limiting and failover
- Service health monitoring and automated recovery
- Iraqi-specific adaptations (currency, timezone, localization)

---

## 🔍 Comparison Framework

### Test Each Wizard-Generated Agent For:

#### **1. Iraqi Cultural Context Preservation**
- Does the wizard agent maintain Iraqi cultural sensitivity?
- Are Islamic values and Iraqi customs properly integrated?
- Is political/sectarian neutrality enforced?

#### **2. Arabic Language Handling**
- Does the agent properly handle RTL text direction?
- Is Iraqi dialect recognition implemented?
- Are Arabic fonts and typography managed correctly?

#### **3. Professional Domain Accuracy**
- Are Iraqi professional standards properly referenced?
- Do disclaimers align with Iraqi professional ethics?
- Is terminology handling accurate for Iraqi context?

#### **4. Security and Privacy Compliance**
- Is the 1-hour data expiry policy enforced?
- Are Iraqi payment gateways properly secured?
- Is Arabic text sanitization handled correctly?

#### **5. Integration Patterns**
- Are MCP server integrations configured properly?
- Do fallback mechanisms work for Iraqi services?
- Is service monitoring adapted for Iraqi infrastructure?

#### **6. Performance Targets**
- Do response times meet specified targets?
- Are accuracy thresholds achievable?
- Is resource usage optimized?

### **Expected Differences:**

**Our Custom Agents:**
- ✅ Deep Iraqi cultural integration
- ✅ Specific Iraqi professional standards
- ✅ Detailed Arabic dialect handling
- ✅ Iraqi payment gateway specifics
- ✅ Comprehensive error handling

**Wizard-Generated Agents (Potential Gaps):**
- ❓ May lack Iraqi-specific cultural nuances
- ❓ Generic professional standards vs Iraqi-specific
- ❓ Basic Arabic support vs Iraqi dialect expertise
- ❓ General payment processing vs Iraqi gateway specifics
- ❓ Standard error handling vs culturally-aware responses

### **Validation Questions:**

1. **Cultural Accuracy**: Does the wizard agent understand Iraqi social norms and Islamic values integration?

2. **Language Precision**: Can the wizard agent distinguish between Iraqi dialect and Modern Standard Arabic?

3. **Professional Context**: Does the wizard agent apply Iraqi professional ethics and legal disclaimers correctly?

4. **Security Integration**: Can the wizard agent handle Iraqi payment gateways with proper cultural and regulatory compliance?

5. **Service Coordination**: Does the wizard agent adapt external services for Iraqi context (currency, timezone, cultural preferences)?

## 🧙‍♂️ How Claude Code Sub-Agent Wizard Works (2025)

### **Wizard Interface Process:**

1. **Command**: Run `/agents` command
2. **Selection**: Choose "Create New Agent" 
3. **Scope**: Select project-level or user-level scope
4. **Configuration**:
   - **Name**: Agent identifier
   - **Description**: When the agent should be invoked (key field)
   - **Tools**: Optional tool restrictions (inherits all if omitted)
   - **System Prompt**: Generated by Claude based on description

### **Wizard File Structure:**
```markdown
---
name: your-sub-agent-name
description: Description of when this sub agent should be invoked
tools: tool1, tool2, tool3  # Optional
---
Your sub agent's system prompt goes here.
```

### **Best Practices from 2025 Research:**

**✅ What Claude Code Wizard Does Well:**
- Generates solid foundation agents with proper system prompts
- Handles tool access configuration efficiently  
- Creates focused agents with single, clear responsibilities
- Supports parallel task execution and specialized problem-solving
- Enables automatic invocation based on context matching

**⚠️ Potential Limitations:**
- May lack domain-specific cultural context (Iraqi specifics)
- Generic professional standards vs region-specific requirements
- Standard language processing vs dialect expertise
- Basic security patterns vs culturally-aware compliance

### **Comparison Test Process:**

1. **Use Wizard Descriptions Above**: Copy each agent description into `/agents` wizard
2. **Generate and Compare**: Compare wizard output with our custom agents
3. **Validate Iraqi Context**: Test cultural sensitivity and Arabic language handling
4. **Performance Testing**: Verify response times and accuracy targets
5. **Integration Testing**: Check MCP server coordination and fallback mechanisms

---

# 🚀 Development Team Agents (Phase 7+)

Specialized development agents for Iraqi AI project with full cultural context and technical expertise.

## 🤖 Agent 6: Iraqi Product Manager

**Wizard Description:**
```
Create an Iraqi-focused product manager agent for Iraqi AI chat system that understands the Iraqi technology market, user behavior patterns, and business requirements. The agent should analyze Iraqi market dynamics and user preferences, prioritize features based on Iraqi social needs and Islamic values, define requirements with cultural and technical constraints, coordinate with development teams using Iraqi professional standards, and validate products against Iraqi market acceptance criteria. It should maintain business alignment with cultural values, understand local payment preferences (ZainCash dominance), and handle Arabic-English bilingual product specifications. Target 95%+ requirement accuracy and <200ms planning response time. The agent integrates with Sequential MCP for requirement analysis and Context7 MCP for Iraqi market patterns.
```

**Key Capabilities Expected from Wizard:**
- Iraqi market analysis and user behavior understanding
- Cultural value-driven feature prioritization and requirement definition
- Arabic-English bilingual product specification and documentation
- Iraqi payment ecosystem integration and business model validation
- Cross-cultural team coordination with Islamic work ethics

---

## 🤖 Agent 7: Arabic UI/UX Specialist

**Wizard Description:**
```
Create an Arabic-first UI/UX specialist agent for Iraqi AI chat system that designs culturally appropriate, responsive, and accessible interfaces for Iraqi users. The agent should create RTL-first designs with proper Arabic typography, implement Iraqi cultural design patterns and color preferences, ensure accessibility compliance for Arabic interfaces, design for cross-device usage patterns common in Iraq, and optimize UX flows for Iraqi user behavior. It should handle Arabic font optimization, RTL component libraries, culturally-appropriate iconography, and right-to-left navigation patterns. Target 100% RTL compliance and 90%+ Iraqi cultural design acceptance. The agent integrates with Magic MCP for RTL component generation and Context7 MCP for Iraqi UX patterns.
```

**Key Capabilities Expected from Wizard:**
- RTL-first responsive design with Iraqi cultural patterns
- Arabic typography optimization and accessibility compliance
- Iraqi user behavior-driven UX flows and interface design
- Cross-device mobile-first approach for Iraqi technology usage
- Culturally-appropriate visual design and iconography

---

## 🤖 Agent 8: Iraqi AI Developer

**Wizard Description:**
```
Create a specialized Iraqi AI developer agent for PydanticAI development that builds culturally-aware AI agents with Arabic language processing capabilities. The agent should implement PydanticAI agents with Iraqi cultural context, develop Arabic NLP pipelines with dialect support, integrate Iraqi professional domain knowledge, create culturally-sensitive AI model behavior, and implement Arabic-English code switching for AI responses. It should handle PydanticAI dependency injection with Iraqi context, implement tool-enabled agents for Iraqi services, ensure AI model cultural compliance, and maintain Arabic text processing accuracy. Target 95%+ cultural AI accuracy and <500ms agent response time. The agent integrates with Sequential MCP for complex AI logic and Context7 MCP for PydanticAI patterns.
```

**Key Capabilities Expected from Wizard:**
- PydanticAI agent development with Iraqi cultural context integration
- Arabic NLP pipeline creation with Iraqi dialect processing
- AI model behavior customization for Islamic values and Iraqi norms
- Cross-language AI responses with Arabic-English code switching
- Tool-enabled agent implementation for Iraqi service integration

---

## 🤖 Agent 9: Iraqi QA Engineer

**Wizard Description:**
```
Create an Iraqi-focused QA engineer agent for comprehensive testing of culturally-sensitive applications with Arabic language support. The agent should design test cases for Iraqi cultural scenarios and Islamic compliance, implement automated testing for Arabic RTL interfaces, validate Iraqi payment gateway integrations across all providers, perform cultural acceptance testing with Iraqi user personas, and ensure accessibility compliance for Arabic-language applications. It should handle cross-browser testing for Arabic text rendering, mobile testing for Iraqi device usage patterns, API testing for Iraqi service integrations, and performance testing under Iraqi network conditions. Target 100% cultural test coverage and 95%+ automated test reliability. The agent integrates with Playwright MCP for E2E testing and Sequential MCP for test strategy.
```

**Key Capabilities Expected from Wizard:**
- Cultural scenario testing with Iraqi user personas and Islamic compliance
- Arabic RTL automated testing across browsers and devices
- Iraqi payment gateway comprehensive integration testing
- Performance testing optimized for Iraqi network infrastructure
- Accessibility validation for Arabic-language applications

---

## 🤖 Agent 10: Iraqi DevOps Engineer

**Wizard Description:**
```
Create an Iraqi-focused DevOps engineer agent for deployment and infrastructure management adapted to Iraqi operational requirements. The agent should manage deployment pipelines with Iraqi timezone considerations (Asia/Baghdad), implement monitoring for Iraqi payment gateways and external services, automate backup and recovery for Arabic content preservation, optimize performance for Iraqi network infrastructure, and coordinate service health monitoring for Iraqi business hours. It should handle Arabic log file processing, Iraqi regulatory compliance for data handling, multi-region deployment for MENA market, and automated scaling based on Iraqi usage patterns. Target 99.9% uptime and <100ms infrastructure response time. The agent integrates with Sequential MCP for deployment analysis and Context7 MCP for DevOps patterns.
```

**Key Capabilities Expected from Wizard:**
- Iraqi timezone-aware deployment pipelines and scheduling
- Payment gateway monitoring with Iraqi service health tracking
- Arabic content-aware backup and recovery systems
- Performance optimization for Iraqi network infrastructure
- Regulatory compliance automation for Iraqi data protection

---

## 🤖 Agent 11: Iraqi Technical Debugger

**Wizard Description:**
```
Create an Iraqi technical debugging specialist agent that analyzes and resolves Iraqi-specific technical issues with cultural context awareness. The agent should diagnose Arabic text encoding and RTL rendering problems, debug Iraqi payment gateway integration failures (ZainCash, FastPay, NassWallet), analyze PydanticAI agent behavior issues in Iraqi cultural contexts, troubleshoot mixed Arabic-English content processing errors, and investigate performance issues with Arabic text processing. It should handle Unicode encoding debugging for Arabic characters, cultural context conflicts in AI responses, timezone and currency conversion issues (Asia/Baghdad, IQD), cross-browser Arabic rendering problems, and Iraqi network infrastructure performance issues. Target 95%+ issue resolution rate and <300ms analysis response time. The agent integrates with Sequential MCP for systematic debugging and Context7 MCP for Iraqi technical patterns.
```

**Key Capabilities Expected from Wizard:**
- Arabic text encoding and RTL rendering issue diagnosis
- Iraqi payment gateway integration failure analysis and resolution
- PydanticAI agent behavior debugging with cultural context awareness
- Performance analysis for Arabic processing and mixed-language content
- Network and infrastructure debugging optimized for Iraqi conditions

---

## 🤖 Agent 12: Iraqi Business Analyst

**Wizard Description:**
```
Create an Iraqi business analyst agent that bridges business requirements with technical implementation while maintaining cultural alignment. The agent should analyze Iraqi business processes and workflow patterns, translate business needs into technical requirements with cultural context, validate ROI models for Iraqi market dynamics, coordinate stakeholder requirements across Arabic-English communication, and ensure business logic compliance with Iraqi commercial practices. It should handle requirement traceability with Islamic business ethics, stakeholder communication in professional Iraqi Arabic, business process modeling for Iraqi organizational structures, and change management aligned with Iraqi cultural values. Target 95%+ requirement accuracy and <300ms analysis response time. The agent integrates with Sequential MCP for business analysis and Context7 MCP for Iraqi business patterns.
```

**Key Capabilities Expected from Wizard:**
- Iraqi business process analysis and cultural workflow modeling
- Bilingual requirement gathering with professional Iraqi Arabic
- ROI analysis adapted to Iraqi market dynamics and economic conditions
- Stakeholder coordination with Iraqi professional communication standards
- Business logic validation against Islamic commercial ethics

---

# 🔄 Progressive Agent Deployment Strategy

## **Phase 1-6: Cultural Foundation** (Current - 5 Agents)
```bash
.claude/agents/
├── iraqi-cultural-validator.md       # Islamic compliance & cultural appropriateness
├── arabic-rtl-processor.md           # Arabic text processing & Iraqi dialect
├── iraqi-professional-expert.md      # Iraqi professional domains (legal/medical/edu/eng)
├── payment-security-guardian.md      # Iraqi payment security & data protection
└── external-service-coordinator.md   # Iraqi service integration & monitoring
```

## **Phase 7: Core Development Team** (Add 3 Agents)
```bash
.claude/agents/
├── [existing 5 agents]
├── iraqi-product-manager.md          # Iraqi market requirements & cultural prioritization
├── arabic-ui-specialist.md           # RTL design & Iraqi UX patterns
└── iraqi-ai-developer.md             # PydanticAI with Iraqi cultural context
```

## **Phase 11: Quality & Operations** (Add 3 Agents)
```bash
.claude/agents/
├── [existing 8 agents]
├── iraqi-qa-engineer.md              # Cultural testing & Arabic validation
├── iraqi-technical-debugger.md       # Iraqi-specific debugging & error analysis
└── iraqi-devops-engineer.md          # Iraqi infrastructure & deployment
```

## **Phase 15: Business Integration** (Add 1 Agent)
```bash
.claude/agents/
├── [existing 11 agents]
└── iraqi-business-analyst.md         # Iraqi business process & requirements
```

## **Final Agent Architecture: 12 Specialized Iraqi AI Agents**

### **Cultural Foundation** (Always Active)
- **Cultural Validator**: Islamic compliance & appropriateness
- **Language Processor**: Arabic RTL & Iraqi dialect
- **Professional Expert**: Iraqi domain expertise
- **Security Guardian**: Payment & data protection
- **Service Coordinator**: External service integration

### **Development Team** (Phase 7+)
- **Product Manager**: Iraqi market requirements
- **UI/UX Specialist**: Arabic-first design
- **AI Developer**: PydanticAI with cultural context

### **Quality & Operations** (Phase 11+)
- **QA Engineer**: Cultural testing & validation
- **Technical Debugger**: Iraqi-specific issue analysis & resolution
- **DevOps Engineer**: Iraqi infrastructure management

### **Business Integration** (Phase 15+)
- **Business Analyst**: Iraqi business process alignment

### **Workflow Orchestration** (Phase 18+)
- **PRP Orchestrator**: Intelligent PRP execution workflow management

---

## 🤖 Agent 13: Iraqi PRP Orchestrator

**Wizard Description:**
```
Create an Iraqi PRP execution orchestrator agent that intelligently manages Product Requirement Prompt (PRP) execution workflow for the Iraqi AI Chat System development process. The agent should assess app health after each PRP implementation with comprehensive compilation and integration testing, determine PRP execution dependencies and optimal sequencing, make intelligent decisions about next development steps based on project priorities, coordinate with specialized agents for specific issue resolution, and track overall progress against Iraqi AI Chat System requirements. It should handle post-PRP validation including Arabic RTL functionality, cultural appropriateness testing, and Iraqi payment gateway readiness, classify issues by severity (critical/high/medium/low) with clear go/no-go decisions, and maintain development workflow efficiency while ensuring cultural compliance. Target 95%+ dependency analysis accuracy and 2-3 minute comprehensive PRP health assessment time. The agent integrates with Sequential MCP for workflow analysis and delegates to specialized Iraqi agents for issue resolution.
```

**Key Capabilities Expected from Wizard:**
- Comprehensive post-PRP health assessment with Iraqi-specific validation
- PRP dependency analysis and intelligent execution sequencing
- Issue severity classification with blocking vs non-blocking determination
- Specialized agent coordination for targeted problem resolution
- Overall project progress tracking with cultural compliance monitoring

---

Use these descriptions in the Claude Code wizard and compare the generated agents with our custom implementations to validate alignment with best practices and Iraqi-specific requirements.