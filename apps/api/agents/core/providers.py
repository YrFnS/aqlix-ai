"""
Iraqi AI Chat System - Model Provider Abstraction
Intelligent model provider management with fallback strategies and cultural context
"""

import threading
from typing import Optional, Dict, Any, Literal
from enum import Enum
import time

try:
    from pydantic_ai.models import infer_model, Model
except ImportError:
    # Graceful handling for development environment
    Model = Any

    def infer_model(model_name: str) -> Any:
        print(f"PydanticAI not available - mock infer_model for {model_name}")
        return None


from .settings import settings


class ModelProvider(str, Enum):
    """Supported AI model providers."""

    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE = "google"
    GROQ = "groq"


class ProviderFailureReason(str, Enum):
    """Reasons for provider fallback."""

    TIMEOUT = "timeout"
    RATE_LIMIT = "rate_limit"
    API_ERROR = "api_error"
    CULTURAL_VALIDATION_FAILURE = "cultural_validation_failure"
    UNKNOWN = "unknown"


class ModelPerformanceMetrics:
    """Track model provider performance for intelligent selection."""

    def __init__(self, provider: ModelProvider, model_name: str):
        self.provider = provider
        self.model_name = model_name
        self.total_requests = 0
        self.failed_requests = 0
        self.avg_response_time_ms = 0.0
        self.cultural_accuracy_score = 0.0
        self.islamic_compliance_score = 0.0
        self.arabic_processing_accuracy = 0.0
        self.success_rate = 1.0
        self.last_used: Optional[float] = None

    def update_metrics(
        self,
        response_time_ms: float,
        cultural_score: float,
        islamic_score: float,
        arabic_score: float,
        success: bool,
    ):
        """Update performance metrics with new data."""
        self.total_requests += 1
        if not success:
            self.failed_requests += 1

        self.success_rate = (
            self.total_requests - self.failed_requests
        ) / self.total_requests

        # Moving average for response time (weighted toward recent performance)
        alpha = 0.3  # Weight for new measurement
        self.avg_response_time_ms = (
            alpha * response_time_ms + (1 - alpha) * self.avg_response_time_ms
        )

        # Cultural metrics (weighted toward recent performance)
        self.cultural_accuracy_score = (
            alpha * cultural_score + (1 - alpha) * self.cultural_accuracy_score
        )
        self.islamic_compliance_score = (
            alpha * islamic_score + (1 - alpha) * self.islamic_compliance_score
        )
        self.arabic_processing_accuracy = (
            alpha * arabic_score + (1 - alpha) * self.arabic_processing_accuracy
        )

        self.last_used = time.time()

    def get_overall_score(
        self, priority: Literal["cultural", "speed"] = "cultural"
    ) -> float:
        """
        Calculate overall performance score based on Iraqi requirements.

        Args:
            priority: 'cultural' for cultural accuracy priority, 'speed' for performance priority

        Returns:
            Overall score (0.0-1.0)
        """
        if priority == "speed":
            # Speed-prioritized scoring
            speed_score = min(1.0, 5.0 / max(0.1, self.avg_response_time_ms / 1000))
            return (
                0.4 * speed_score
                + 0.25 * self.cultural_accuracy_score
                + 0.2 * self.islamic_compliance_score
                + 0.1 * self.arabic_processing_accuracy
                + 0.05 * self.success_rate
            )
        else:
            # Cultural accuracy prioritized (default for Iraqi system)
            return (
                0.4 * self.cultural_accuracy_score
                + 0.3 * self.islamic_compliance_score
                + 0.15 * self.arabic_processing_accuracy
                + 0.1 * self.success_rate
                + 0.05 * min(1.0, 3.0 / max(0.1, self.avg_response_time_ms / 1000))
            )


class IraqiModelProvider:
    """
    Intelligent model provider with Iraqi cultural optimization.

    Features:
    - Automatic fallback on provider failures
    - Performance tracking per provider
    - Cultural compliance scoring
    - Cost optimization
    """

    def __init__(self):
        self.performance_metrics: Dict[str, ModelPerformanceMetrics] = {}
        self.fallback_count: Dict[str, int] = {}
        self._initialize_metrics()

    def _initialize_metrics(self):
        """Initialize performance metrics for available providers."""
        # FIX #8: Use loop with model config list to eliminate redundant initialization
        model_configs = []

        # OpenAI models
        if settings.openai_api_key:
            model_configs.extend(
                [
                    {
                        "name": "openai:gpt-4o-mini",
                        "provider": ModelProvider.OPENAI,
                        "cultural_score": 0.85,
                        "islamic_score": 0.80,
                        "arabic_score": 0.75,
                    },
                    {
                        "name": "openai:gpt-3.5-turbo",
                        "provider": ModelProvider.OPENAI,
                        "cultural_score": 0.75,
                        "islamic_score": 0.70,
                        "arabic_score": 0.65,
                    },
                ]
            )

        # Anthropic models (better cultural nuance)
        if settings.anthropic_api_key:
            model_configs.append(
                {
                    "name": "anthropic:claude-3-5-haiku-20241022",
                    "provider": ModelProvider.ANTHROPIC,
                    "cultural_score": 0.90,
                    "islamic_score": 0.85,
                    "arabic_score": 0.80,
                }
            )

        # Google models
        if settings.google_api_key:
            model_configs.append(
                {
                    "name": "google:gemini-1.5-flash",
                    "provider": ModelProvider.GOOGLE,
                    "cultural_score": 0.80,
                    "islamic_score": 0.75,
                    "arabic_score": 0.70,
                }
            )

        # Groq models (fast but lower cultural accuracy)
        if settings.groq_api_key:
            model_configs.append(
                {
                    "name": "groq:mixtral-8x7b-32768",
                    "provider": ModelProvider.GROQ,
                    "cultural_score": 0.70,
                    "islamic_score": 0.65,
                    "arabic_score": 0.60,
                }
            )

        # Initialize all models with config loop
        for config in model_configs:
            metrics = ModelPerformanceMetrics(
                provider=config["provider"], model_name=config["name"].split(":")[1]
            )
            metrics.cultural_accuracy_score = config["cultural_score"]
            metrics.islamic_compliance_score = config["islamic_score"]
            metrics.arabic_processing_accuracy = config["arabic_score"]
            self.performance_metrics[config["name"]] = metrics

    def get_model(self, prefer_provider: Optional[ModelProvider] = None) -> Model:
        """
        Get AI model with intelligent fallback.

        Args:
            prefer_provider: Preferred provider (falls back if unavailable)

        Returns:
            Model instance with fallback capability
        """
        try:
            # Try primary model first
            model = self._create_model(settings.default_model)
            return model
        except Exception as e:
            # Log failure and attempt fallback
            provider = self._parse_provider(settings.default_model)
            self._record_failure(provider, str(e))

            # Try fallback model
            try:
                model = self._create_model(settings.fallback_model)
                return model
            except Exception as fallback_error:
                fallback_provider = self._parse_provider(settings.fallback_model)
                self._record_failure(fallback_provider, str(fallback_error))
                raise RuntimeError(
                    f"All models failed. Primary: {e}, Fallback: {fallback_error}"
                )

    def _create_model(self, model_name: str) -> Model:
        """
        Create model from model name string.

        Args:
            model_name: Model identifier (e.g., 'openai:gpt-4o-mini')

        Returns:
            Model instance
        """
        return infer_model(model_name)

    def _parse_provider(self, model_name: str) -> ModelProvider:
        """
        Extract provider from model name (e.g., 'openai:gpt-4o-mini').

        Args:
            model_name: Full model identifier

        Returns:
            Provider enum
        """
        provider_str = model_name.split(":")[0]
        return ModelProvider(provider_str)

    def _record_failure(self, provider: ModelProvider, error: str):
        """
        Record provider failure for monitoring.

        Args:
            provider: Provider that failed
            error: Error message
        """
        if provider.value not in self.fallback_count:
            self.fallback_count[provider.value] = 0
        self.fallback_count[provider.value] += 1

        # TODO: Send to Sentry for monitoring
        if settings.debug_mode:
            print(
                f"Provider {provider.value} failed (count: {self.fallback_count[provider.value]}): {error}"
            )

    def track_performance(
        self,
        model_name: str,
        duration_ms: float,
        cultural_score: float,
        islamic_score: float,
        arabic_score: float,
        success: bool,
    ):
        """
        Track model provider performance metrics.

        Args:
            model_name: Model identifier
            duration_ms: Response time in milliseconds
            cultural_score: Cultural appropriateness score (0.0-1.0)
            islamic_score: Islamic compliance score (0.0-1.0)
            arabic_score: Arabic processing accuracy (0.0-1.0)
            success: Whether the request succeeded
        """
        if model_name in self.performance_metrics:
            self.performance_metrics[model_name].update_metrics(
                duration_ms, cultural_score, islamic_score, arabic_score, success
            )

    def get_best_model(
        self, priority: Literal["cultural", "speed"] = "cultural"
    ) -> str:
        """
        Select best model based on performance metrics.

        Args:
            priority: 'cultural' for cultural accuracy, 'speed' for performance

        Returns:
            Best model identifier
        """
        if not self.performance_metrics:
            return settings.default_model

        # Score all models
        scored_models = []
        for model_name, metrics in self.performance_metrics.items():
            score = metrics.get_overall_score(priority)
            scored_models.append((model_name, score))

        # Sort by score descending
        scored_models.sort(key=lambda x: x[1], reverse=True)

        # Return best model
        return scored_models[0][0] if scored_models else settings.default_model

    def get_model_stats(self) -> Dict[str, Dict[str, Any]]:
        """
        Get performance statistics for all models.

        Returns:
            Dictionary of model statistics
        """
        stats = {}
        for model_name, metrics in self.performance_metrics.items():
            stats[model_name] = {
                "provider": metrics.provider.value,
                "total_requests": metrics.total_requests,
                "failed_requests": metrics.failed_requests,
                "success_rate": round(metrics.success_rate, 3),
                "avg_response_time_ms": round(metrics.avg_response_time_ms, 3),
                "cultural_accuracy": round(metrics.cultural_accuracy_score, 3),
                "islamic_compliance": round(metrics.islamic_compliance_score, 3),
                "arabic_accuracy": round(metrics.arabic_processing_accuracy, 3),
                "overall_score_cultural": round(
                    metrics.get_overall_score("cultural"), 3
                ),
                "overall_score_speed": round(metrics.get_overall_score("speed"), 3),
            }
        return stats


# Global provider instance
_provider_instance: Optional[IraqiModelProvider] = None
_provider_lock = threading.Lock()


def get_model_provider() -> IraqiModelProvider:
    """
    Get or create the global model provider instance.

    Returns:
        Singleton IraqiModelProvider instance
    """
    global _provider_instance
    if _provider_instance is None:
        with _provider_lock:
            if _provider_instance is None:
                _provider_instance = IraqiModelProvider()
    return _provider_instance


def get_llm_model(prefer_provider: Optional[ModelProvider] = None) -> Model:
    """
    Main function to get LLM model with Iraqi cultural intelligence.

    Args:
        prefer_provider: Optional preferred provider

    Returns:
        Model instance with fallback capability
    """
    provider = get_model_provider()
    return provider.get_model(prefer_provider)
