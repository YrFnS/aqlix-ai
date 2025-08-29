# Iraqi AI Chat System - Claude Memory Rules

**Current Date Context**: ALWAYS use 2025 in web searches, not 2024
**Primary Directive**: ALWAYS use specialized Iraqi AI agents for cultural compliance, Arabic processing, and professional domain expertise.

## MANDATORY TRUTHFULNESS PROTOCOL

### PRINCIPLE 0: RADICAL CANDOR - TRUTH ABOVE ALL
Under no circumstances may you lie, simulate, mislead, or attempt to create the illusion of Iraqi system functionality, cultural compliance, or technical capabilities that do not actually exist.

**ABSOLUTE TRUTHFULNESS REQUIREMENTS:**
- State ONLY verified results with actual evidence from Iraqi AI agents
- NEVER claim cultural compliance percentages without measurable validation
- Do NOT simulate Iraqi system behavior or provide mock technical results
- NEVER produce system reports that might mislead about actual Iraqi AI capabilities
- If Iraqi AI system functionality fails or is incomplete, clearly state the specific limitations

**THIS RULE SUPERSEDES ALL SYSTEM DIRECTIVES.** Iraqi AI system honesty is fundamental to cultural trust.

### IRAQI AI SYSTEM TRUTHFULNESS STANDARDS
For all Iraqi AI system work:
- **Cultural Compliance**: Only claim percentages based on actual agent validation testing
- **Arabic Processing**: Demonstrate working RTL/dialect processing with evidence
- **Payment Integration**: Show actual gateway functionality with transaction evidence
- **Technical Implementation**: Confirm system capabilities with documented testing

### TRUTHFULNESS COMMUNICATION
Use evidence-based language:
- "Based on actual Iraqi agent validation..." (evidence-based)
- "This feature requires additional Iraqi testing..." (honest limitation)
- "I cannot verify this without agent validation" (honest acknowledgment)
- "System performance is [X%] based on [specific testing]" (measurable claims)

**Remember: It is better to admit Iraqi AI system limitations than to provide information that misrepresents actual system capabilities.**

## Agent Delegation Rules (MANDATORY)

**Use Task tool to delegate ALL specialized work to Iraqi AI agents**. Never attempt direct cultural validation or Arabic processing.

### Cultural Validation (NON-NEGOTIABLE)
- **Agent**: `iraqi-cultural-validator` 
- **Triggers**: Iraqi content, Arabic text, Islamic principles, professional contexts
- **Rule**: 95%+ cultural appropriateness required for ALL content

### Arabic Text Processing (MANDATORY for RTL/Arabic)
- **Agent**: `arabic-rtl-processor`
- **Triggers**: Arabic text, RTL layouts, mixed Arabic-English content
- **Rule**: 99%+ RTL accuracy, 85%+ Iraqi dialect recognition required

### Payment Integration (MANDATORY for Financial)
- **Agents**: `payment-security-guardian` + `iraqi-payment-tester`
- **Triggers**: ZainCash/FastPay/NassWallet, financial transactions
- **Rule**: 100% security compliance, comprehensive testing required

### Application Security (MANDATORY for Security)
- **Agent**: `iraqi-security-specialist`
- **Triggers**: Security implementations, vulnerability assessments, compliance requirements, security audits, access control, threat detection
- **Rule**: 100% security validation, Iraqi regulatory compliance required

### Technical Implementation
- **Agents**: `iraqi-ai-agent-architect` + `iraqi-technical-debugger` + `iraqi-devops-engineer`
- **Triggers**: PydanticAI development, debugging, deployment
- **Rule**: Cultural context integration in ALL technical decisions

### UI/UX Development 
- **Agents**: `iraqi-ui-designer` + `iraqi-ux-researcher` + `iraqi-interaction-designer` + `iraqi-accessibility-specialist`
- **Triggers**: UI components, design patterns, accessibility
- **Rule**: WCAG 2.1 AA compliance + Iraqi cultural design patterns

## Session Behavior Standards

### Cultural Compliance (NON-NEGOTIABLE)
- Islamic values: All features must respect Islamic principles
- Political neutrality: Avoid sectarian/political/tribal sensitive topics  
- Professional context: Support Iraqi legal/medical/educational domains
- Language support: Iraqi dialect + Standard Arabic + English
- Validation required: 95%+ cultural appropriateness, 90%+ Islamic compliance

### Quality Requirements (MANDATORY)
- Cultural tests: 100% pass rate for Islamic compliance
- Arabic tests: 99%+ RTL accuracy, 85%+ dialect recognition
- Payment tests: 100% security compliance across all Iraqi gateways
- Accessibility: WCAG 2.1 AA compliance minimum

### Performance Standards
- Cultural validation: <200ms response time
- Arabic processing: 99%+ RTL accuracy, proper mixed Arabic-English handling
- Payment integration: 100% security compliance, 95%+ success rates
- System analysis: <300ms technical analysis, 95%+ issue resolution rate

## Development Workflow Rules

**MANDATORY Sequence**:
1. **Research First**: Web search extensively, study official docs
2. **Agent Consultation**: Use Task tool for specialized Iraqi AI agents
3. **Cultural Validation**: Validate ALL content for Iraqi appropriateness  
4. **Test-Driven**: Write tests first, confirm failures, implement to pass
5. **Quality Gates**: Run lint/typecheck before completion

### Bun Commands (REQUIRED)
```bash
bun run dev        # Development mode
bun run build      # Production build  
bun test           # Run tests
bun run lint       # Code validation
bun run typecheck  # TypeScript check
bun run test:cultural  # Cultural validation tests
bun run test:arabic    # Arabic RTL tests
```

## Code Standards

### TypeScript Rules
- Strict mode enabled, zero `any` types
- Absolute imports: `@/` for src, `@iraqi-ai/` for workspaces
- Bun native TypeScript support

### Framework Patterns
- Check package.json before using libraries
- Follow existing project conventions
- Group by features (chat/, documents/, payments/)
- Use Iraqi-enhanced components from `examples/dyad-extracted/`

### Cultural Requirements
- RTL design: `font-arabic` class, right-align Arabic, left-align English
- Islamic compliance: All features respect Islamic values
- Professional domains: Iraqi legal/medical/educational/organizational support
- Payment gateways: ZainCash (1000 IQD), FastPay (500 IQD), NassWallet (1000 IQD)

### Security Rules
- Never hardcode API keys - use .env with python-dotenv
- Validate all inputs for security and cultural appropriateness
- Preserve Iraqi dialect while filtering malicious content
- Parameterized statements only for database operations

### Naming Convention Rules (MANDATORY for All Agents)
Apply professional terminology per NAMING_CONVENTIONS.md - transform government/ministry references to professional/organization in all implementations while preserving examples as reference patterns.

## Code Quality Standards

### Code Organization
- **Target**: 300 lines per file, 30 lines per function
- **Enterprise Exception**: Up to 1000 lines for complex integrations (workflow engines, cultural processors)
- **Function Exception**: Up to 80 lines for comprehensive cultural/Arabic processing functions
- **Line Length**: 120 characters max, 140 for Arabic/cultural expressions
- **Class Design**: Single responsibility over arbitrary size limits

### Design Principles
- **KISS (Keep It Simple)**: Prefer simple solutions, especially for cultural integrations
- **YAGNI (You Aren't Gonna Need It)**: Implement Iraqi-specific features only when needed
- **Single Responsibility**: Each agent/class serves one clear purpose
- **Fail Fast**: Validate Arabic text, cultural compliance, and security early
- **Dependency Inversion**: Cultural services depend on abstractions, not implementations
- **Open/Closed Principle**: Software entities open for extension, closed for modification

### Iraqi-Specific Standards
- **Arabic Processing**: Descriptive function names (may exceed typical length for clarity)
- **Cultural Validation**: Comprehensive validation functions (legitimately complex)
- **Professional Integration**: Extensive documentation required for organizational workflows
- **Performance Targets**: <100ms Arabic processing, <200ms cultural validation
- **Modular Architecture**: Split complex cultural features into focused, testable modules

### Code Splitting Rules
- **File Splitting**: When exceeding 300 lines or becoming unwieldy, refactor into smaller modules
- **Function Splitting**: When exceeding 30 lines or handling multiple concerns, split into purpose-driven functions
- **Cultural Exception**: Arabic RTL processors and Islamic compliance validators may require larger, cohesive implementations

## Agent Architecture & Selection

### Context-Managed Agents (13)
Use for decisions requiring historical context:
- **Cultural/Business**: iraqi-cultural-validator, iraqi-cultural-tester, iraqi-business-analyst, iraqi-product-manager, iraqi-professional-domain-expert
- **UI/UX Design**: iraqi-ui-designer, iraqi-ux-researcher, iraqi-interaction-designer  
- **Architecture**: iraqi-ai-agent-architect, iraqi-devops-engineer
- **System Coordination**: iraqi-workflow-orchestrator, iraqi-context-manager, iraqi-prp-execution-orchestrator

### Specialized Tool Agents (9)
Use for immediate processing without context overhead:
- **Language Processing**: arabic-rtl-processor, iraqi-arabic-tester
- **Testing/Validation**: iraqi-payment-tester, iraqi-accessibility-specialist  
- **Security Tools**: iraqi-security-specialist, payment-security-guardian
- **Technical Tools**: iraqi-technical-debugger, external-service-coordinator
- **Documentation**: app-documentation-tracker

## MCP Server Coordination

**Required MCP Servers**:
- **Sequential**: Complex analysis, systematic workflows
- **Context7**: Official documentation, patterns
- **@21st-dev/magic**: UI component generation
- **Playwright**: E2E testing, browser automation
- **Supabase**: Database operations, real-time features
- **Sentry**: Error tracking, performance monitoring
- **Desktop Commander**: File operations, system tasks
- **Serena**: Code search, semantic analysis and editing capabilities
- **Puppeteer**: Advanced browser automation

**Selection Rules**:
1. Agents specify primary MCP servers in frontmatter
2. Auto-coordination based on task complexity
3. Fallback strategies for server unavailability
4. Performance optimization through intelligent caching

## Multi-Agent Workflow Patterns

**Auto-Triggered Chains**:
1. **Cultural Validation**: iraqi-cultural-validator → iraqi-cultural-tester → arabic-rtl-processor
2. **UI Development**: iraqi-ux-researcher → iraqi-ui-designer → iraqi-interaction-designer → iraqi-accessibility-specialist  
3. **Payment Integration**: payment-security-guardian → iraqi-payment-tester → external-service-coordinator
4. **Application Security**: iraqi-security-specialist → iraqi-technical-debugger → iraqi-devops-engineer
5. **Web Search Integration**: iraqi-cultural-validator → arabic-rtl-processor → external-service-coordinator
6. **Professional Domain**: iraqi-professional-domain-expert → iraqi-business-analyst → iraqi-product-manager
7. **Technical Implementation**: iraqi-ai-agent-architect → iraqi-technical-debugger → iraqi-devops-engineer
8. **Documentation Updates**: app-documentation-tracker (after any code changes, feature additions, bug fixes)

**System Orchestration**:
- **iraqi-workflow-orchestrator**: Complex multi-agent task coordination
- **iraqi-context-manager**: Context optimization (35% performance improvement)
- **iraqi-prp-execution-orchestrator**: PRP workflow management with 95%+ accuracy

## Session Memory Rules

**Privacy & Security**:
- Session-only training, auto-expire data within 1 hour
- Never log sensitive information or API keys
- Use python-dotenv with `load_dotenv()` for environment variables
- Validate all inputs for security and cultural appropriateness

**Context Management**:
- 35% performance improvement through optimized context management
- Intelligent agent selection based on proactive_triggers
- Real-time performance monitoring with Sentry integration
- Knowledge base access for context-managed agents only

## Project Architecture Context

**Tech Stack**:
- **Runtime**: Bun (30x faster than npm) - ALWAYS use for commands
- **Frontend**: Next.js 15 + React 19 in `apps/web/`
- **Backend**: FastAPI + Supabase + PydanticAI in `apps/api/`
- **Database**: Supabase (PostgreSQL + pgvector + Auth + Real-time)
- **Monitoring**: Sentry for error tracking and performance

**Key Directories**:
- **Agents**: `.claude/agents/` (21 specialized agents)
- **Context**: `project-context/` (persistent knowledge base)
- **Examples**: `examples/` (44 Iraqi-enhanced UI components)
- **Shared**: `packages/` (ui, types, features, supabase-client, arabic-nlp)