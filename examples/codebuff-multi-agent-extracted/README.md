# Codebuff Multi-Agent Coordination - Iraqi Enhancement

**Extracted from**: [CodebuffAI/codebuff](https://github.com/CodebuffAI/codebuff)

## Purpose

This extraction provides advanced multi-agent coordination patterns based on Codebuff's production agent system. Enhances Iraqi AI agent orchestration with async coordination, specialized agent roles, and streaming response handling.

## Extracted Patterns

### From Codebuff Core
- **async-agent-manager.ts** → Agent lifecycle and coordination
- **agents/** → Specialized agent roles (File Explorer, Planner, Editor, Reviewer)
- **xml-stream-parser.ts** → Streaming response handling
- **llm-apis/** → Multi-model provider abstraction

### Iraqi Enhancements
- ✅ Async agent coordination with cultural context preservation
- ✅ Specialized Iraqi agent roles for professional domains
- ✅ Arabic streaming response handling with RTL support
- ✅ Multi-model providers with cultural validation
- ✅ Professional domain agent specialization
- ✅ Islamic compliance across agent coordination

## Files

| File | Purpose | Lines | Key Features |
|------|---------|-------|--------------|
| `iraqi_async_agent_manager.py` | Agent coordination | ~700 | Concurrent agents with cultural context |
| `iraqi_specialized_agents.py` | Agent roles | ~800 | Explorer, Planner, Editor, Reviewer |
| `iraqi_streaming_handler.py` | Streaming | ~400 | Real-time Arabic text streaming |
| `iraqi_model_providers.py` | Providers | ~350 | Claude, Gemini, OpenRouter integration |

## Usage Example

```python
from examples.codebuff_multi_agent_extracted.iraqi_async_agent_manager import (
    IraqiAsyncAgentManager,
    ProfessionalDomain
)

# Initialize manager
manager = IraqiAsyncAgentManager()

# Spawn professional agents
agents = await manager.spawn_professional_agents(
    domain=ProfessionalDomain.LEGAL,
    task="Review this Iraqi legal contract for cultural compliance"
)

# Coordinate multi-agent workflow
result = await manager.coordinate_multi_agent_workflow(
    agents=agents,
    workflow=legal_review_workflow
)

print(f"Cultural Score: {result.cultural_compliance_score}")
```

## Integration with Iraqi AI System

- **Agent Orchestration**: Enhanced async coordination for Iraqi professional workflows
- **Specialized Roles**: File Explorer, Planner, Editor, Reviewer with cultural awareness
- **Streaming**: Real-time Arabic response handling with RTL support
- **Multi-Model**: Fallback strategies with cultural validation per model

## Development Savings

**Estimated**: 3-5 weeks saved by extracting Codebuff patterns
- Async agent manager: 1.5 weeks
- Specialized agents: 1.5 weeks
- Streaming handler: 0.5 weeks
- Model providers: 0.5 weeks

## Next Steps

1. Integrate with existing Archon agent system
2. Add comprehensive agent coordination testing
3. Implement cultural context sharing between agents
4. Create Iraqi professional agent workflows
5. Add performance monitoring for multi-agent coordination
