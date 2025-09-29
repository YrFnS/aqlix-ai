# Suggested Commands for Iraqi AI Project

## Development Commands

- `npm run dev`: Start all applications in development mode
- `npm run build`: Build all applications for production
- `npm run test`: Run all tests (unit, integration, cultural)
- `npm run typecheck`: TypeScript compilation check
- `npm run lint`: Code style validation

## PydanticAI Agent Development

- Always use python-dotenv with `load_dotenv()`
- Follow examples/main_agent_reference/ patterns
- Use virtual environments - create if one doesn't exist
- Use async/await consistently for PydanticAI patterns
- Test with TestModel/FunctionModel to avoid API costs

## Project Structure Commands

- `/generate-prp` or `/generate-pydantic-ai-prp` for feature development
- Focus on examples/ directory for PydanticAI patterns
- Keep agent files under 500 lines (agent.py, tools.py, models.py)

## Cultural Testing

- Test Arabic text handling (RTL direction, Iraqi dialect)
- Validate cultural appropriateness for Iraqi context
- Test payment gateway integration
