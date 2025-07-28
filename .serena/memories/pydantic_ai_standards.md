# PydanticAI Development Standards

## Agent Architecture Patterns
- Use environment-based configuration with python-dotenv and pydantic-settings
- Default to string outputs - Only use `result_type` when structured output needed
- Implement dependency injection with `deps_type` for external services
- Follow examples/main_agent_reference/ patterns for production-grade agents

## Critical Environment Configuration
```python
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

class Settings(BaseSettings):
    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )
    
    llm_api_key: str = Field(..., description="API key for LLM provider")
    llm_model: str = Field(default="gpt-4", description="Model name")

def load_settings() -> Settings:
    load_dotenv()  # CRITICAL: Always load .env first
    return Settings()
```

## Testing Standards
- Use TestModel for development - Fast validation without API costs
- Use FunctionModel for custom behavior - Control agent responses
- Use Agent.override() for testing - Replace models in test contexts
- Test Iraqi-specific scenarios - Cultural validation, Arabic text

## Security Best Practices
- Never hardcode API keys - Use .env files with load_dotenv()
- Use Pydantic models for input validation
- Implement Iraqi cultural filtering
- Sanitize inputs while preserving dialect