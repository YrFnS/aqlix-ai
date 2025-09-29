# Execute Iraqi AI PRP with Archon Management

Implement a feature using the PRP file with systematic Archon task management and Iraqi AI agent coordination.

## PRP File: $ARGUMENTS

## MANDATORY: Archon Task Management Workflow

**CRITICAL RULE: NEVER skip Archon task management at any point in this process.**

### Pre-Implementation Setup

1. **Create Project in Archon** (if not exists)
   - Use `mcp__archon__manage_project` to ensure project exists
   - Project name: "Iraqi AI Chat System"

2. **Create ALL PRP Tasks in Archon**
   - Parse PRP requirements into discrete tasks
   - Create each task with `mcp__archon__manage_task("create", ...)`
   - Set all initial status to "todo"
   - Include clear acceptance criteria for each task

## Execution Process

### 1. **Load PRP with Archon Tracking**

- Read the specified PRP file
- **Create Archon task**: "Analyze PRP requirements"
- Update task status to "doing" with `mcp__archon__manage_task("update", task_id=..., status="doing")`
- Understand all context and requirements
- Follow all instructions in the PRP and extend research if needed
- **Complete task** and mark as "done"

### 2. **ULTRATHINK with Task Creation**

- **Create Archon task**: "Plan implementation strategy"
- Update to "doing" status
- Think comprehensively about implementation approach
- Break down ALL requirements into specific, actionable Archon tasks
- Use the TodoWrite tool for local tracking alongside Archon
- Identify implementation patterns from existing code
- **Complete planning task** and mark as "done"

### 3. **Execute with Sequential Task Management**

- **RULE**: Only ONE task in "doing" status at a time
- For each implementation task:
  a. Update task status to "doing"
  b. Use specialized Iraqi AI agents as needed:
  - `iraqi-cultural-validator` for cultural compliance
  - `arabic-rtl-processor` for Arabic/RTL features
  - `iraqi-technical-debugger` for debugging
  - `iraqi-security-specialist` for security features
    c. Implement the specific task requirements
    d. **Complete task** and mark as "done"
    e. Move to next task

### 4. **Validate with Archon Tracking**

- **Create Archon task**: "Validation and testing"
- Update to "doing" status
- Run each validation command specified in PRP
- Use `iraqi-cultural-tester` for cultural validation
- Use `iraqi-accessibility-specialist` for accessibility checks
- Fix any failures and re-run until all pass
- **Complete validation task** and mark as "done"

### 5. **Complete with Final Archon Review**

- **Create Archon task**: "Final completion review"
- Update to "doing" status
- Ensure all PRP checklist items completed
- Run final validation suite (bun run lint, bun run typecheck)
- Cross-reference with original PRP requirements
- **Complete final task** and mark as "done"

### 6. **Archon Error Handling**

- If Archon operations fail, retry once
- Document any persistent Archon issues
- Use TodoWrite as backup task tracking if needed
- Continue with systematic workflow regardless

## Iraqi AI Agent Integration Rules

- **Cultural Validation**: Always use `iraqi-cultural-validator` for content/UI
- **Arabic Processing**: Always use `arabic-rtl-processor` for Arabic text/RTL
- **Security Features**: Always use `iraqi-security-specialist` for security
- **Technical Issues**: Always use `iraqi-technical-debugger` for complex bugs

**Remember**: Archon provides centralized coordination while Iraqi AI agents provide specialized domain expertise.
