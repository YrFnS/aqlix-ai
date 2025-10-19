# Iraqi AI Chat System - Claude Memory Rules

**CRITICAL: READ ARCHON WORKFLOW RULES FIRST** - See `archon.md` for task management workflow.

**Current Date Context**: ALWAYS use 2025 in web searches, not 2024
**Primary Directive**: ALWAYS use specialized agents, each agent has its specialized role.

## Mandatory

As an autonomous agent you will:

1. Call vibe_check after planning and before major actions.
2. Provide the full user request and your current plan.
3. Optionally, record resolved issues with vibe_learn.

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

### GitHub Workflow (Agent-Automated)

**Philosophy**: All GitHub operations are **automated by agents** during PRP execution. See `docs/GITHUB_WORKFLOW.md` for complete strategy.

**Two-Branch Strategy**:

- `main` - Production-ready, stable code only
- `develop` - Ongoing PRP work (all development happens here)

**How It Works**:

- Agent commits all PRPs to `develop` branch
- CI/CD validates every push to `develop`
- Agent merges `develop` → `main` when feature layer complete (e.g., after PRPs 11-16)
- Agent creates version tags on `main` for milestones

**Agent Automation**:

- `iraqi-prp-execution-orchestrator` manages commits, issues, merges, tags automatically
- `iraqi-devops-engineer` manages CI/CD validation
- `app-documentation-tracker` updates docs after changes

**No manual GitHub operations required** - agents handle everything via GitHub MCP + CLI.

### CI/CD Pipeline (4-Phase Incremental)

**Status**: Phase 1 Complete ✅ | Phases 2-4 Planned 📋

**Active Workflows** (`.github/workflows/`):

- **ci.yml**: Quality gates (lint, typecheck, build, test) - runs on push/PR
- **pr.yml**: PR validation (title format, breaking changes, cultural/Arabic checks, bundle size)

**Roadmap** (`docs/CICD_ROADMAP.md`):

- **Phase 1 (NOW)**: Basic quality gates ✅ DONE
- **Phase 2 (After Initial #16)**: Arabic/RTL/Cultural tests 📋 PLANNED
- **Phase 3 (After Initial #28)**: E2E, Payment, Security tests 📋 PLANNED
- **Phase 4 (Before MVP Launch)**: Staging/Production deployment 📋 PLANNED

**All PRs must pass**:

- ✅ ESLint validation
- ✅ TypeScript type checking
- ✅ Build validation
- ✅ Unit tests
- ✅ PR title format (feat/fix/docs/cultural/arabic/...)
- ✅ Bundle size < 500KB warning

**Cultural/Arabic Validation** (Phase 1 detection only):

- 🎯 Detects cultural-sensitive file changes
- 🎯 Detects Arabic/RTL file changes
- 🎯 Runs cultural/arabic tests if available (doesn't fail CI yet)
- ⏭️ Will enforce thresholds in Phase 2 (95% cultural, 99% RTL, 85% dialect)

### Bun Commands (REQUIRED)

```bash
bun run dev        # Development mode
bun run build      # Production build
bun test           # Run tests
bun run lint       # Code validation
bun run typecheck  # TypeScript check
bun run test:cultural  # Cultural validation tests
bun run test:arabic    # Arabic RTL tests
bun run test:image     # Image processing tests
bun run test:voice     # Voice/audio tests
bun run test:desktop   # Desktop application tests
```

## Code Standards

### TypeScript Rules

- Strict mode enabled, zero `any` types
- Absolute imports: `@/` for src, `@iraqi-ai/` for workspaces
- Bun native TypeScript support

### Framework Patterns

- Check package.json before using libraries
- Follow existing project conventions
- Group by features (chat/, documents/, payments/, images/, voice/, desktop/)
- Use Iraqi-enhanced components from 79 example folders (prioritize `*-enhanced` variants)

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

### Available MCP Servers

**Core Infrastructure**:

1. **Archon** (MANDATORY for ALL agents)
   - **Capabilities**: Task management, project coordination, documents, versions, RAG knowledge base
   - **Tools**: `find_tasks`, `manage_task`, `find_projects`, `manage_project`, `find_documents`, `manage_document`, `find_versions`, `manage_version`, `rag_search_knowledge_base`, `rag_search_code_examples`
   - **Use Case**: Universal task tracking, project management, knowledge retrieval
   - **Required by**: ALL 22 agents (task management is universal)

2. **Serena** (Code Intelligence)
   - **Capabilities**: Semantic code search, symbol analysis, code editing, AST operations
   - **Tools**: `find_symbol`, `find_referencing_symbols`, `get_symbols_overview`, `replace_symbol_body`, `insert_after_symbol`, `search_for_pattern`
   - **Use Case**: Intelligent code navigation, refactoring, semantic understanding
   - **Required by**: technical-debugger, ai-agent-architect, documentation-tracker, devops-engineer

3. **Context7** (Documentation)
   - **Capabilities**: Up-to-date library documentation, code examples, patterns
   - **Tools**: `resolve-library-id`, `get-library-docs`
   - **Use Case**: Research latest APIs, implementation patterns, best practices
   - **Required by**: ai-agent-architect, technical-debugger, devops-engineer, ui-designer

**Development Tools**:

4. **GitHub** (Repository Management)
   - **Capabilities**: PRs, issues, workflows, code search, releases, branches, commits
   - **Tools**: `create_pull_request`, `create_issue`, `search_code`, `list_workflow_runs`, `get_commit`, `create_branch`
   - **Use Case**: Version control operations, CI/CD integration, issue tracking
   - **Required by**: devops-engineer, technical-debugger, documentation-tracker, prp-execution-orchestrator

5. **Supabase** (Database & Backend)
   - **Capabilities**: Database operations, auth, real-time subscriptions, edge functions
   - **Tools**: `execute_sql`, `apply_migration`, `list_tables`, `get_project`, `deploy_edge_function`
   - **Use Case**: Database schema management, auth configuration, backend operations
   - **Required by**: technical-debugger, devops-engineer, security-specialist, ai-agent-architect
   - **Status**: Project `iraqi-ai` in EU-Central-1
   - **Database**: PostgreSQL 17.6.1 (production-ready)

**Testing & Quality**:

6. **Playwright** (Browser Automation)
   - **Capabilities**: E2E testing, browser interactions, visual testing, network inspection
   - **Tools**: `browser_navigate`, `browser_click`, `browser_snapshot`, `browser_take_screenshot`, `browser_evaluate`
   - **Use Case**: End-to-end testing, user flow validation, visual regression
   - **Required by**: payment-tester, arabic-tester, cultural-tester, accessibility-specialist

7. **chrome-devtools** (Advanced Browser Testing)
   - **Capabilities**: Performance profiling, network analysis, console monitoring, DOM inspection
   - **Tools**: `take_snapshot`, `click`, `fill`, `evaluate_script`, `performance_start_trace`, `list_console_messages`
   - **Use Case**: Performance debugging, advanced browser testing, network analysis
   - **Required by**: devops-engineer, payment-tester, accessibility-specialist

**Monitoring & Security**:

8. **Sentry** (Error Tracking)
   - **Capabilities**: Error tracking, performance monitoring, issue management, release tracking
   - **Tools**: `search_issues`, `get_issue_details`, `search_events`, `get_trace_details`, `search_docs`
   - **Use Case**: Production error monitoring, performance analysis, debugging
   - **Required by**: technical-debugger, devops-engineer, security-specialist

9. **Semgrep** (Code Security)
   - **Configuration**: `{"command": "semgrep", "args": ["mcp"]}`
   - **Capabilities**: Static code analysis, security vulnerability detection
   - **Required by**: security-specialist, payment-security-guardian

**UI & Design**:

10. **@21st-dev/magic** (UI Components)
    - **Capabilities**: AI-powered UI component generation, design inspiration, component refinement
    - **Tools**: `21st_magic_component_builder`, `21st_magic_component_inspiration`, `21st_magic_component_refiner`, `logo_search`
    - **Use Case**: Rapid UI prototyping, component generation, design inspiration
    - **Required by**: ui-designer, interaction-designer, accessibility-specialist

**Meta-Cognition**:

11. **vibe-check** (Quality Assurance)
    - **Capabilities**: Metacognitive questioning, pattern recognition, mistake learning, constitutional rules
    - **Tools**: `vibe_check`, `vibe_learn`, `update_constitution`, `check_constitution`
    - **Use Case**: Prevent cascading errors, learn from mistakes, quality gates
    - **Required by**: workflow-orchestrator, prp-execution-orchestrator, context-manager

**Context & Memory**:

12. **Pieces** (Long-Term Memory)
    - **Capabilities**: Historical context retrieval, workstream summaries, cross-session memory
    - **Tools**: `ask_pieces_ltm`, `create_pieces_memory`
    - **Use Case**: Retrieve project history, access past decisions, create persistent memories
    - **Required by**: context-manager, prp-execution-orchestrator, technical-debugger

### MCP Selection Rules

1. **ARCHON-FIRST RULE**: Always use Archon MCP for task management (see `archon.md`)
2. **Agent Frontmatter**: Each agent specifies required MCPs in frontmatter `mcp_servers` field
3. **Auto-Coordination**: System selects MCPs based on task type and complexity
4. **Fallback Strategies**: Graceful degradation when MCPs unavailable
5. **Performance Optimization**: Intelligent caching, parallel MCP calls
6. **Context Sharing**: MCPs share context through Archon knowledge base

### MCP Configuration Matrix

| Agent                        | Archon | Serena | Context7 | GitHub | Supabase | Sentry | Playwright | Chrome-DevTools | 21st-dev | Vibe-Check | Pieces |
| ---------------------------- | ------ | ------ | -------- | ------ | -------- | ------ | ---------- | --------------- | -------- | ---------- | ------ |
| **Core Orchestration**       |
| workflow-orchestrator        | ✅     | ❌     | ❌       | ❌     | ❌       | ❌     | ❌         | ❌              | ❌       | ✅         | ❌     |
| prp-execution-orchestrator   | ✅     | ✅     | ❌       | ✅     | ❌       | ✅     | ❌         | ❌              | ❌       | ✅         | ✅     |
| context-manager              | ✅     | ✅     | ❌       | ❌     | ❌       | ❌     | ❌         | ❌              | ❌       | ✅         | ✅     |
| **Technical**                |
| ai-agent-architect           | ✅     | ✅     | ✅       | ❌     | ✅       | ❌     | ❌         | ❌              | ❌       | ❌         |
| technical-debugger           | ✅     | ✅     | ✅       | ✅     | ✅       | ✅     | ❌         | ❌              | ❌       | ❌         |
| devops-engineer              | ✅     | ✅     | ✅       | ✅     | ✅       | ✅     | ❌         | ✅              | ❌       | ❌         |
| **Security**                 |
| security-specialist          | ✅     | ✅     | ❌       | ❌     | ✅       | ✅     | ❌         | ❌              | ❌       | ❌         |
| payment-security-guardian    | ✅     | ❌     | ❌       | ❌     | ❌       | ✅     | ✅         | ❌              | ❌       | ❌         |
| **Testing**                  |
| payment-tester               | ✅     | ❌     | ❌       | ❌     | ❌       | ❌     | ✅         | ✅              | ❌       | ❌         |
| arabic-tester                | ✅     | ❌     | ❌       | ❌     | ❌       | ❌     | ✅         | ❌              | ❌       | ❌         |
| cultural-tester              | ✅     | ❌     | ❌       | ❌     | ❌       | ❌     | ✅         | ❌              | ❌       | ❌         |
| accessibility-specialist     | ✅     | ✅     | ❌       | ❌     | ❌       | ❌     | ✅         | ✅              | ✅       | ❌         |
| **UI/UX**                    |
| ui-designer                  | ✅     | ❌     | ✅       | ❌     | ❌       | ❌     | ❌         | ❌              | ✅       | ❌         |
| ux-researcher                | ✅     | ❌     | ❌       | ❌     | ❌       | ❌     | ❌         | ❌              | ❌       | ❌         |
| interaction-designer         | ✅     | ❌     | ✅       | ❌     | ❌       | ❌     | ❌         | ❌              | ✅       | ❌         |
| **Cultural**                 |
| cultural-validator           | ✅     | ❌     | ❌       | ❌     | ❌       | ❌     | ❌         | ❌              | ❌       | ❌         |
| arabic-rtl-processor         | ✅     | ❌     | ❌       | ❌     | ❌       | ❌     | ❌         | ❌              | ❌       | ❌         |
| professional-domain-expert   | ✅     | ❌     | ❌       | ❌     | ❌       | ❌     | ❌         | ❌              | ❌       | ❌         |
| **Business**                 |
| product-manager              | ✅     | ❌     | ❌       | ❌     | ❌       | ❌     | ❌         | ❌              | ❌       | ❌         |
| business-analyst             | ✅     | ❌     | ❌       | ❌     | ❌       | ❌     | ❌         | ❌              | ❌       | ❌         |
| **Utility**                  |
| documentation-tracker        | ✅     | ✅     | ❌       | ✅     | ❌       | ❌     | ❌         | ❌              | ❌       | ❌         |
| external-service-coordinator | ✅     | ❌     | ❌       | ❌     | ❌       | ✅     | ❌         | ❌              | ❌       | ❌         |

## Multi-Agent Workflow Patterns

**Auto-Triggered Chains**:

1. **Cultural Validation**: iraqi-cultural-validator → iraqi-cultural-tester → arabic-rtl-processor
2. **UI Development**: iraqi-ux-researcher → iraqi-ui-designer → iraqi-interaction-designer → iraqi-accessibility-specialist
3. **Payment Integration**: payment-security-guardian → iraqi-payment-tester → external-service-coordinator
4. **Application Security**: iraqi-security-specialist → iraqi-technical-debugger → iraqi-devops-engineer
5. **Web Search Integration**: iraqi-cultural-validator → arabic-rtl-processor → external-service-coordinator
6. **Professional Domain**: iraqi-professional-domain-expert → iraqi-business-analyst → iraqi-product-manager
7. **Technical Implementation**: iraqi-ai-agent-architect → iraqi-technical-debugger → iraqi-devops-engineer
8. **Image Processing**: iraqi-cultural-validator → arabic-rtl-processor → iraqi-accessibility-specialist
9. **Voice/Audio System**: iraqi-cultural-validator → arabic-rtl-processor → iraqi-technical-debugger
10. **Documentation Updates**: app-documentation-tracker (after any code changes, feature additions, bug fixes)

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

## 🏗️ Monorepo Structure

```
/
├── .claude/                    # Agent system & automation
│   ├── agents/                 # 22 specialized Iraqi AI agents
│   ├── hooks/                  # Automated quality scripts (format.sh, lint.sh)
│   └── settings.json           # Claude Code hooks configuration
├── .github/                    # CI/CD infrastructure
│   └── workflows/              # GitHub Actions workflows (ci.yml, pr.yml)
├── apps/
│   ├── web/                    # Next.js 15+ web application
│   ├── mobile/                 # React Native app (future)
│   └── api/                    # Python FastAPI backend
│       ├── agents/             # PydanticAI agent modules
│       │   ├── agent.py        # Main agent definition
│       │   ├── tools.py        # Agent tools and integrations
│       │   ├── models.py       # Pydantic models and dependencies
│       │   └── settings.py     # Environment configuration
│       ├── routes/             # FastAPI route handlers
│       └── services/           # Business logic services
├── packages/                   # Shared between web & mobile
│   ├── ui/                     # Shared UI components
│   ├── types/                  # TypeScript types
│   ├── features/              # Shared business logic (chat/, documents/, payments/)
│   ├── api-client/            # API client logic
│   └── arabic-nlp/            # Arabic processing logic
├── docs/                      # Technical documentation
│   ├── CICD_ROADMAP.md        # 4-phase CI/CD strategy and implementation plan
│   ├── GITHUB_WORKFLOW.md     # Agent-automated GitHub workflow strategy
│   ├── HOOKS_SETUP.md         # Claude Code hooks complete guide
│   └── HOOK_TEST_REPORT.md    # Hook testing results and status
├── examples/                   # Reference implementations
│   ├── basic_chat_agent/       # Simple PydanticAI agent patterns
│   ├── main_agent_reference/   # Production agent architecture
│   ├── tool_enabled_agent/     # Agent with external tools
│   ├── structured_output_agent/ # Professional report generation
│   └── testing_examples/       # Agent testing patterns
├── initials/                   # System templates (56 total: 1-47 MVP, 48-56 Post-MVP)
├── project-context/            # Persistent knowledge base
│   ├── agents/                 # Agent-specific context
│   │   ├── knowledge-base/     # Accumulated domain knowledge
│   │   └── session-logs/       # Historical session data
│   └── current-context.md      # Active session context
├── PRPs/                      # Product Requirement Prompts
├── services/                   # Microservices
└── CLAUDE.md                  # This rules file
```

**Key Directories**:

- **Agents**: `.claude/agents/` (22 specialized agents)
- **Hooks**: `.claude/hooks/` (format.sh, lint.sh automation scripts)
- **Workflows**: `.github/workflows/` (CI/CD automation pipelines)
- **Documentation**: `docs/` (Technical documentation, roadmaps, hook guides)
- **Context**: `project-context/` (persistent knowledge base)
- **Examples**: `examples/` (79 Iraqi-enhanced components and integrations)
- **Initials**: `initials/` (56 system templates: 1-47 MVP, 48-56 Post-MVP)
- **Shared**: `packages/` (ui, types, features, api-client, arabic-nlp)

**Key Documentation**:

- **CLAUDE.md**: This file - project rules and guidelines
- **docs/HOOKS_SETUP.md**: Complete hook documentation and troubleshooting
- **docs/HOOK_TEST_REPORT.md**: Hook testing results and status
- **docs/CICD_ROADMAP.md**: CI/CD implementation strategy
- **docs/GITHUB_WORKFLOW.md**: GitHub automation workflow
