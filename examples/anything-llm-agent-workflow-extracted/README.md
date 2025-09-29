# Iraqi AI Agent Workflow System

Adapted from Anything-LLM's visual builder, automation engine, and multi-step orchestration for Iraqi professional workflows.

## Features

- Drag-drop visual builder with RTL Arabic labels
- Cultural validation nodes (95%+ compliance)
- Professional workflows: legal consultation, medical triage
- Supabase-triggered orchestration
- Pydantic models for cultural hooks

## Setup

```bash
bun install
bun run dev
```

## Testing

```bash
bun test
bun test workflow-cultural  # Cultural compliance tests
```

## Integration with iraqi-workflow-orchestrator

- Use `AgentFlowEngine` to orchestrate workflows
- Hook into Supabase triggers for real-time execution
- Ensure 95%+ cultural compliance via validation nodes

## Compliance

All workflows integrate iraqi-cultural-validator and arabic-rtl-processor for 95%+ compliance.
