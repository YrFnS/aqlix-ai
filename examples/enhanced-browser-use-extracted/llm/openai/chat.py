"""
Enhanced OpenAI chat model with Iraqi AI integration.
Extracted from browser-use with cultural validation and Arabic RTL support.
"""

from collections.abc import Iterable, Mapping
from dataclasses import dataclass
from typing import Any, Literal, TypeVar, overload

import httpx
from openai import APIConnectionError, APIStatusError, AsyncOpenAI, RateLimitError
from openai.types.chat import ChatCompletionContentPartTextParam
from openai.types.chat.chat_completion import ChatCompletion
from openai.types.shared.chat_model import ChatModel
from openai.types.shared_params.reasoning_effort import ReasoningEffort
from openai.types.shared_params.response_format_json_schema import JSONSchema, ResponseFormatJSONSchema
from pydantic import BaseModel

from ..base import BaseChatModel, IraqiChatModelMixin
from ..exceptions import ModelProviderError
from ..messages import BaseMessage
from ..openai.serializer import OpenAIMessageSerializer
from ..schema import SchemaOptimizer
from ..views import ChatInvokeCompletion, ChatInvokeUsage

T = TypeVar('T', bound=BaseModel)

ReasoningModels: list[ChatModel | str] = [
    'o4-mini',
    'o3', 
    'o3-mini',
    'o1',
    'o1-pro',
    'o3-pro',
    'gpt-5',
    'gpt-5-mini',
    'gpt-5-nano',
]


@dataclass
class ChatOpenAI(IraqiChatModelMixin, BaseChatModel):
    """
    Enhanced OpenAI chat model with Iraqi AI integration.
    
    Provides cultural validation, Arabic RTL processing, and Islamic compliance
    on top of OpenAI's chat completion models.
    """

    # Model configuration
    model: ChatModel | str

    # Model params
    temperature: float | None = 0.2
    frequency_penalty: float | None = 0.3  # Avoids infinite generation
    reasoning_effort: ReasoningEffort = 'low'
    seed: int | None = None
    service_tier: Literal['auto', 'default', 'flex', 'priority', 'scale'] | None = None
    top_p: float | None = None
    add_schema_to_system_prompt: bool = False

    # Client initialization parameters
    api_key: str | None = None
    organization: str | None = None
    project: str | None = None
    base_url: str | httpx.URL | None = None
    websocket_base_url: str | httpx.URL | None = None
    timeout: float | httpx.Timeout | None = None
    max_retries: int = 5
    default_headers: Mapping[str, str] | None = None
    default_query: Mapping[str, object] | None = None
    http_client: httpx.AsyncClient | None = None
    _strict_response_validation: bool = False
    max_completion_tokens: int | None = 4096

    # Iraqi AI enhancements
    cultural_validation: bool = True
    arabic_rtl_support: bool = True
    islamic_compliance: bool = True

    def __post_init__(self):
        """Initialize Iraqi AI enhancements."""
        super().__init__(
            cultural_validation=self.cultural_validation,
            arabic_rtl_support=self.arabic_rtl_support,
            islamic_compliance=self.islamic_compliance
        )

    @property
    def provider(self) -> str:
        return 'iraqi-enhanced-openai'

    def _get_client_params(self) -> dict[str, Any]:
        """Prepare client parameters dictionary."""
        base_params = {
            'api_key': self.api_key,
            'organization': self.organization,
            'project': self.project,
            'base_url': self.base_url,
            'websocket_base_url': self.websocket_base_url,
            'timeout': self.timeout,
            'max_retries': self.max_retries,
            'default_headers': self.default_headers,
            'default_query': self.default_query,
            '_strict_response_validation': self._strict_response_validation,
        }

        # Create client_params dict with non-None values
        client_params = {k: v for k, v in base_params.items() if v is not None}

        # Add http_client if provided
        if self.http_client is not None:
            client_params['http_client'] = self.http_client

        return client_params

    def get_client(self) -> AsyncOpenAI:
        """
        Returns an AsyncOpenAI client.

        Returns:
            AsyncOpenAI: An instance of the AsyncOpenAI client.
        """
        client_params = self._get_client_params()
        return AsyncOpenAI(**client_params)

    @property
    def name(self) -> str:
        return f"Iraqi-Enhanced-{self.model}"

    def _get_usage(self, response: ChatCompletion) -> ChatInvokeUsage | None:
        """Extract usage statistics from OpenAI response."""
        if response.usage is not None:
            completion_tokens = response.usage.completion_tokens
            completion_token_details = response.usage.completion_tokens_details
            if completion_token_details is not None:
                reasoning_tokens = completion_token_details.reasoning_tokens
                if reasoning_tokens is not None:
                    completion_tokens += reasoning_tokens

            usage = ChatInvokeUsage(
                prompt_tokens=response.usage.prompt_tokens,
                prompt_cached_tokens=response.usage.prompt_tokens_details.cached_tokens
                if response.usage.prompt_tokens_details is not None
                else None,
                prompt_cache_creation_tokens=None,
                prompt_image_tokens=None,
                completion_tokens=completion_tokens,
                total_tokens=response.usage.total_tokens,
            )
        else:
            usage = None

        return usage

    @overload
    async def ainvoke(self, messages: list[BaseMessage], output_format: None = None) -> ChatInvokeCompletion[str]:
        ...

    @overload
    async def ainvoke(self, messages: list[BaseMessage], output_format: type[T]) -> ChatInvokeCompletion[T]:
        ...

    async def ainvoke(
        self, messages: list[BaseMessage], output_format: type[T] | None = None
    ) -> ChatInvokeCompletion[T] | ChatInvokeCompletion[str]:
        """
        Enhanced invoke with Iraqi AI processing pipeline.

        Args:
            messages: List of chat messages
            output_format: Optional Pydantic model class for structured output

        Returns:
            Chat completion with Iraqi AI enhancements
        """
        # Pre-process messages with Iraqi AI enhancements
        processed_messages = []
        for msg in messages:
            if self._arabic_rtl_support and msg.has_arabic_content():
                content = await self._process_arabic_rtl(msg.extract_text_content())
                # Create new message with processed content
                new_msg = type(msg)(content)
                new_msg.arabic_content_detected = True
                processed_messages.append(new_msg)
            else:
                processed_messages.append(msg)

        openai_messages = OpenAIMessageSerializer.serialize_messages(processed_messages)

        try:
            model_params: dict[str, Any] = {}

            if self.temperature is not None:
                model_params['temperature'] = self.temperature

            if self.frequency_penalty is not None:
                model_params['frequency_penalty'] = self.frequency_penalty

            if self.max_completion_tokens is not None:
                model_params['max_completion_tokens'] = self.max_completion_tokens

            if self.top_p is not None:
                model_params['top_p'] = self.top_p

            if self.seed is not None:
                model_params['seed'] = self.seed

            if self.service_tier is not None:
                model_params['service_tier'] = self.service_tier

            # Handle reasoning models
            if any(str(m).lower() in str(self.model).lower() for m in ReasoningModels):
                model_params['reasoning_effort'] = self.reasoning_effort
                # Remove temperature and frequency_penalty for reasoning models
                model_params.pop('temperature', None)
                model_params.pop('frequency_penalty', None)

            if output_format is None:
                # Return string response
                response = await self.get_client().chat.completions.create(
                    model=self.model,
                    messages=openai_messages,
                    **model_params,
                )

                usage = self._get_usage(response)
                completion_content = response.choices[0].message.content or ''

                # Apply Iraqi AI post-processing
                if self._cultural_validation_enabled:
                    is_appropriate, validation_msg = await self._validate_cultural_appropriateness(completion_content)
                    if not is_appropriate:
                        raise ModelProviderError(
                            message=f"Cultural validation failed: {validation_msg}",
                            status_code=400,
                            model=self.name,
                        )

                if self._islamic_compliance_mode:
                    is_compliant, compliance_msg = await self._ensure_islamic_compliance(completion_content)
                    if not is_compliant:
                        raise ModelProviderError(
                            message=f"Islamic compliance failed: {compliance_msg}",
                            status_code=400,
                            model=self.name,
                        )

                return ChatInvokeCompletion(
                    completion=completion_content,
                    usage=usage,
                )

            else:
                response_format: JSONSchema = {
                    'name': 'agent_output',
                    'strict': True,
                    'schema': SchemaOptimizer.create_optimized_json_schema(output_format),
                }

                # Add JSON schema to system prompt if requested
                if self.add_schema_to_system_prompt and openai_messages and openai_messages[0]['role'] == 'system':
                    schema_text = f'\n<json_schema>\n{response_format}\n</json_schema>'
                    if isinstance(openai_messages[0]['content'], str):
                        openai_messages[0]['content'] += schema_text
                    elif isinstance(openai_messages[0]['content'], Iterable):
                        openai_messages[0]['content'] = list(openai_messages[0]['content']) + [
                            ChatCompletionContentPartTextParam(text=schema_text, type='text')
                        ]

                # Return structured response
                response = await self.get_client().chat.completions.create(
                    model=self.model,
                    messages=openai_messages,
                    response_format=ResponseFormatJSONSchema(json_schema=response_format, type='json_schema'),
                    **model_params,
                )

                if response.choices[0].message.content is None:
                    raise ModelProviderError(
                        message='Failed to parse structured output from model response',
                        status_code=500,
                        model=self.name,
                    )

                usage = self._get_usage(response)

                # Apply Iraqi AI validation to structured output
                content_str = response.choices[0].message.content
                if self._cultural_validation_enabled:
                    is_appropriate, validation_msg = await self._validate_cultural_appropriateness(content_str)
                    if not is_appropriate:
                        raise ModelProviderError(
                            message=f"Cultural validation failed: {validation_msg}",
                            status_code=400,
                            model=self.name,
                        )

                parsed = output_format.model_validate_json(content_str)

                return ChatInvokeCompletion(
                    completion=parsed,
                    usage=usage,
                )

        except RateLimitError as e:
            error_message = e.response.json().get('error', {})
            error_message = (
                error_message.get('message', 'Unknown model error') if isinstance(error_message, dict) else error_message
            )
            raise ModelProviderError(
                message=error_message,
                status_code=e.response.status_code,
                model=self.name,
            ) from e

        except APIConnectionError as e:
            raise ModelProviderError(message=str(e), model=self.name) from e

        except APIStatusError as e:
            try:
                error_message = e.response.json().get('error', {})
            except Exception:
                error_message = e.response.text
            error_message = (
                error_message.get('message', 'Unknown model error') if isinstance(error_message, dict) else error_message
            )
            raise ModelProviderError(
                message=error_message,
                status_code=e.response.status_code,
                model=self.name,
            ) from e

        except Exception as e:
            raise ModelProviderError(message=str(e), model=self.name) from e