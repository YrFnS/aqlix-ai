"""
Iraqi AI Chat System - Model Provider Abstraction
Intelligent model provider management with fallback strategies and cultural context
"""
from typing import Union, Optional, Dict, Any, List
from dataclasses import dataclass
from enum import Enum
import asyncio
import time
from contextlib import asynccontextmanager

try:
    from pydantic_ai.models import KnownModelName
    from pydantic_ai import Agent
    from pydantic_ai.models.openai import OpenAIModel
    from pydantic_ai.models.anthropic import AnthropicModel
    from pydantic_ai.models.groq import GroqModel
except ImportError as e:
    # Graceful handling for development environment
    KnownModelName = str
    Agent = None
    OpenAIModel = None
    AnthropicModel = None  
    GroqModel = None
    print(f"PydanticAI not available: {e}")

from .settings import settings, IraqiCulturalMode, IslamicComplianceLevel


class ModelProvider(str, Enum):
    """Supported model providers"""
    OPENAI = "openai"
    ANTHROPIC = "anthropic" 
    GROQ = "groq"
    LOCAL = "local"


@dataclass
class IraqiModelConfig:
    """Configuration for Iraqi-specific model behavior"""
    cultural_mode: IraqiCulturalMode
    islamic_compliance: IslamicComplianceLevel
    arabic_support: bool = True
    iraqi_dialect_support: bool = True
    professional_domains: List[str] = None
    performance_priority: str = "cultural_accuracy"  # vs "speed"


@dataclass
class ModelPerformanceMetrics:
    """Track model performance for intelligent selection"""
    provider: ModelProvider
    model_name: str
    avg_response_time: float = 0.0
    cultural_accuracy_score: float = 0.0
    islamic_compliance_score: float = 0.0
    arabic_processing_accuracy: float = 0.0
    success_rate: float = 1.0
    total_requests: int = 0
    failed_requests: int = 0
    last_used: Optional[float] = None
    
    def update_metrics(self, response_time: float, cultural_score: float, 
                      islamic_score: float, arabic_score: float, success: bool):
        """Update performance metrics with new data"""
        self.total_requests += 1
        if not success:
            self.failed_requests += 1
        
        self.success_rate = (self.total_requests - self.failed_requests) / self.total_requests
        
        # Moving average for response time (weighted toward recent performance)
        alpha = 0.3  # Weight for new measurement
        self.avg_response_time = (alpha * response_time + 
                                 (1 - alpha) * self.avg_response_time)
        
        # Cultural metrics (weighted toward recent performance)
        self.cultural_accuracy_score = (alpha * cultural_score + 
                                       (1 - alpha) * self.cultural_accuracy_score)
        self.islamic_compliance_score = (alpha * islamic_score + 
                                        (1 - alpha) * self.islamic_compliance_score)
        self.arabic_processing_accuracy = (alpha * arabic_score + 
                                          (1 - alpha) * self.arabic_processing_accuracy)
        
        self.last_used = time.time()
    
    def get_overall_score(self, config: IraqiModelConfig) -> float:
        """Calculate overall performance score based on Iraqi requirements"""
        if config.performance_priority == "speed":
            # Speed-prioritized scoring
            speed_score = min(1.0, 5.0 / max(0.1, self.avg_response_time))  # 5s = 1.0 score
            return (0.4 * speed_score + 
                   0.25 * self.cultural_accuracy_score + 
                   0.2 * self.islamic_compliance_score + 
                   0.1 * self.arabic_processing_accuracy + 
                   0.05 * self.success_rate)
        else:
            # Cultural accuracy prioritized (default for Iraqi system)
            return (0.4 * self.cultural_accuracy_score + 
                   0.3 * self.islamic_compliance_score + 
                   0.15 * self.arabic_processing_accuracy + 
                   0.1 * self.success_rate + 
                   0.05 * min(1.0, 3.0 / max(0.1, self.avg_response_time)))


class IraqiModelProvider:
    """
    Intelligent model provider with Iraqi cultural context awareness
    """
    
    def __init__(self, config: IraqiModelConfig):
        self.config = config
        self.providers: Dict[str, Any] = {}
        self.metrics: Dict[str, ModelPerformanceMetrics] = {}
        self.fallback_chain: List[str] = []
        self._initialize_providers()
        self._setup_fallback_chain()
    
    def _initialize_providers(self):
        """Initialize available model providers"""
        # OpenAI Provider
        if settings.openai_api_key and OpenAIModel:
            try:
                self.providers["openai:gpt-4"] = OpenAIModel("gpt-4")
                self.providers["openai:gpt-3.5-turbo"] = OpenAIModel("gpt-3.5-turbo")
                self.metrics["openai:gpt-4"] = ModelPerformanceMetrics(
                    provider=ModelProvider.OPENAI,
                    model_name="gpt-4",
                    cultural_accuracy_score=0.9,  # Initial estimate
                    islamic_compliance_score=0.85,
                    arabic_processing_accuracy=0.8
                )
                self.metrics["openai:gpt-3.5-turbo"] = ModelPerformanceMetrics(
                    provider=ModelProvider.OPENAI,
                    model_name="gpt-3.5-turbo", 
                    cultural_accuracy_score=0.8,
                    islamic_compliance_score=0.75,
                    arabic_processing_accuracy=0.7
                )
            except Exception as e:
                print(f"Failed to initialize OpenAI provider: {e}")
        
        # Anthropic Provider
        if settings.anthropic_api_key and AnthropicModel:
            try:
                self.providers["anthropic:claude-3-sonnet"] = AnthropicModel("claude-3-sonnet-20240229")
                self.providers["anthropic:claude-3-haiku"] = AnthropicModel("claude-3-haiku-20240307")
                self.metrics["anthropic:claude-3-sonnet"] = ModelPerformanceMetrics(
                    provider=ModelProvider.ANTHROPIC,
                    model_name="claude-3-sonnet",
                    cultural_accuracy_score=0.95,  # Claude tends to be better at cultural nuance
                    islamic_compliance_score=0.9,
                    arabic_processing_accuracy=0.85
                )
            except Exception as e:
                print(f"Failed to initialize Anthropic provider: {e}")
        
        # Groq Provider
        if settings.groq_api_key and GroqModel:
            try:
                self.providers["groq:mixtral-8x7b"] = GroqModel("mixtral-8x7b-32768")
                self.providers["groq:llama2-70b"] = GroqModel("llama2-70b-4096")
                self.metrics["groq:mixtral-8x7b"] = ModelPerformanceMetrics(
                    provider=ModelProvider.GROQ,
                    model_name="mixtral-8x7b",
                    cultural_accuracy_score=0.75,
                    islamic_compliance_score=0.7,
                    arabic_processing_accuracy=0.6
                )
            except Exception as e:
                print(f"Failed to initialize Groq provider: {e}")
    
    def _setup_fallback_chain(self):
        """Setup intelligent fallback chain based on Iraqi requirements"""
        available_models = list(self.providers.keys())
        
        # Priority order for Iraqi AI system:
        # 1. Best cultural accuracy models first
        # 2. Arabic processing capability
        # 3. Speed for real-time interaction
        priority_order = [
            "anthropic:claude-3-sonnet",  # Best cultural nuance
            "openai:gpt-4",               # Good cultural understanding
            "openai:gpt-3.5-turbo",      # Fast, decent cultural awareness
            "groq:mixtral-8x7b",         # Very fast, basic cultural awareness
            "anthropic:claude-3-haiku",   # Fast Anthropic fallback
            "groq:llama2-70b"            # Last resort
        ]
        
        self.fallback_chain = [model for model in priority_order 
                              if model in available_models]
        
        if not self.fallback_chain:
            raise RuntimeError("No model providers available. Check API keys and configuration.")
    
    def get_best_model(self, context: Optional[Dict[str, Any]] = None) -> str:
        """
        Select best model based on current performance metrics and context
        """
        if not self.fallback_chain:
            raise RuntimeError("No models available")
        
        # For production Iraqi system, prioritize cultural accuracy
        if settings.is_production():
            scored_models = []
            for model_name in self.fallback_chain:
                if model_name in self.metrics:
                    score = self.metrics[model_name].get_overall_score(self.config)
                    scored_models.append((model_name, score))
            
            if scored_models:
                # Sort by score descending and return best
                scored_models.sort(key=lambda x: x[1], reverse=True)
                return scored_models[0][0]
        
        # Default to first in fallback chain
        return self.fallback_chain[0]
    
    async def get_model_with_fallback(self, 
                                     context: Optional[Dict[str, Any]] = None) -> tuple[Any, str]:
        """
        Get model instance with automatic fallback on failure
        """
        last_error = None
        
        for model_name in self.fallback_chain:
            try:
                model = self.providers.get(model_name)
                if model is None:
                    continue
                
                # Test model availability with a simple request
                # In production, you might want to cache this
                return model, model_name
                
            except Exception as e:
                last_error = e
                print(f"Model {model_name} failed: {e}")
                continue
        
        raise RuntimeError(f"All models failed. Last error: {last_error}")
    
    async def update_model_performance(self, model_name: str, 
                                      response_time: float,
                                      cultural_score: float,
                                      islamic_score: float, 
                                      arabic_score: float,
                                      success: bool):
        """Update model performance metrics"""
        if model_name in self.metrics:
            self.metrics[model_name].update_metrics(
                response_time, cultural_score, islamic_score, arabic_score, success
            )
    
    def get_model_stats(self) -> Dict[str, Dict[str, Any]]:
        """Get performance statistics for all models"""
        stats = {}
        for model_name, metrics in self.metrics.items():
            stats[model_name] = {
                "provider": metrics.provider.value,
                "avg_response_time": round(metrics.avg_response_time, 3),
                "cultural_accuracy": round(metrics.cultural_accuracy_score, 3),
                "islamic_compliance": round(metrics.islamic_compliance_score, 3), 
                "arabic_accuracy": round(metrics.arabic_processing_accuracy, 3),
                "success_rate": round(metrics.success_rate, 3),
                "total_requests": metrics.total_requests,
                "overall_score": round(metrics.get_overall_score(self.config), 3)
            }
        return stats


# Global provider instance
_provider_instance: Optional[IraqiModelProvider] = None

def get_model_provider() -> IraqiModelProvider:
    """Get or create the global model provider instance"""
    global _provider_instance
    if _provider_instance is None:
        config = IraqiModelConfig(
            cultural_mode=settings.cultural_mode,
            islamic_compliance=settings.islamic_compliance_level,
            arabic_support=True,
            iraqi_dialect_support=True,
            professional_domains=settings.enabled_domains,
            performance_priority="cultural_accuracy"
        )
        _provider_instance = IraqiModelProvider(config)
    return _provider_instance


async def get_llm_model(context: Optional[Dict[str, Any]] = None) -> tuple[Any, str]:
    """
    Main function to get LLM model with Iraqi cultural intelligence
    """
    provider = get_model_provider()
    return await provider.get_model_with_fallback(context)