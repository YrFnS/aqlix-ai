"""
Iraqi Agent Factory - Centralized Agent Creation and Management

Factory pattern for creating and managing Iraqi-enhanced PydanticAI agents
with cultural intelligence, professional domain specialization, and
comprehensive Arabic language processing.

🎯 Quality Standards:
- Agent Creation: <100ms initialization time
- Cultural Intelligence: 95%+ compliance across all agents
- Memory Efficiency: Shared cultural intelligence models
- Scalability: Support for 50+ concurrent agent instances

🔧 Factory Features:
- Centralized agent configuration and creation
- Shared cultural intelligence resources
- Agent lifecycle management
- Performance monitoring and metrics
- Professional domain specialization
- Agent registry and discovery
"""

import asyncio
import logging
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional, Type, TypeVar, Union
from dataclasses import dataclass, field

from .iraqi_base_agent import (
    IraqiBaseAgent,
    IraqiAgentDependencies,
    IraqiCulturalContext,
    IraqiCulturalIntelligence,
)
from .iraqi_rag_agent import IraqiRagAgent

logger = logging.getLogger(__name__)

# Generic type for Iraqi agents
IraqiAgentT = TypeVar("IraqiAgentT", bound=IraqiBaseAgent)


class IraqiAgentType(Enum):
    """Available Iraqi agent types with cultural specializations."""

    RAG_AGENT = "rag_agent"
    CULTURAL_VALIDATOR = "cultural_validator"
    ARABIC_PROCESSOR = "arabic_processor"
    LEGAL_ADVISOR = "legal_advisor"
    MEDICAL_ASSISTANT = "medical_assistant"
    EDUCATIONAL_HELPER = "educational_helper"
    GOVERNMENT_SERVICE = "government_service"
    BUSINESS_ANALYST = "business_analyst"
    TECHNICAL_WRITER = "technical_writer"
    TRANSLATION_AGENT = "translation_agent"


class IraqiProfessionalDomain(Enum):
    """Iraqi professional domains with cultural requirements."""

    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    GOVERNMENT = "government"
    BUSINESS = "business"
    TECHNICAL = "technical"
    RELIGIOUS = "religious"
    SOCIAL = "social"
    GENERAL = "general"


@dataclass
class IraqiAgentConfiguration:
    """Configuration for creating Iraqi agents with cultural intelligence."""

    agent_type: IraqiAgentType
    professional_domain: IraqiProfessionalDomain = IraqiProfessionalDomain.GENERAL

    # Model configuration
    model: str = "openai:gpt-4o-mini"
    name: Optional[str] = None

    # Cultural intelligence settings
    enable_cultural_intelligence: bool = True
    enable_arabic_processing: bool = True
    cultural_compliance_threshold: float = 0.95
    islamic_compliance_threshold: float = 0.90

    # Performance settings
    enable_rate_limiting: bool = True
    retries: int = 3
    timeout_seconds: float = 120.0

    # Professional context
    professional_context: Dict[str, Any] = field(default_factory=dict)
    cultural_context: Optional[IraqiCulturalContext] = None

    # Advanced settings
    custom_system_prompt: Optional[str] = None
    additional_tools: List[str] = field(default_factory=list)
    performance_monitoring: bool = True


@dataclass
class IraqiAgentInstance:
    """Managed Iraqi agent instance with metadata and metrics."""

    agent_id: str
    agent: IraqiBaseAgent
    configuration: IraqiAgentConfiguration
    created_at: datetime

    # Performance metrics
    total_requests: int = 0
    successful_requests: int = 0
    failed_requests: int = 0
    avg_response_time_ms: float = 0.0

    # Cultural intelligence metrics
    avg_cultural_compliance: float = 0.0
    avg_islamic_compliance: float = 0.0
    avg_arabic_processing_accuracy: float = 0.0

    # Status
    is_active: bool = True
    last_used: Optional[datetime] = None

    def update_metrics(
        self,
        success: bool,
        response_time_ms: int,
        cultural_compliance: float = 0.0,
        islamic_compliance: float = 0.0,
        arabic_accuracy: float = 0.0,
    ):
        """Update agent performance and cultural metrics."""
        self.total_requests += 1
        self.last_used = datetime.now()

        if success:
            self.successful_requests += 1
        else:
            self.failed_requests += 1

        # Update response time average
        if self.total_requests == 1:
            self.avg_response_time_ms = float(response_time_ms)
        else:
            self.avg_response_time_ms = (
                self.avg_response_time_ms * (self.total_requests - 1) + response_time_ms
            ) / self.total_requests

        # Update cultural metrics averages
        if cultural_compliance > 0:
            if self.total_requests == 1:
                self.avg_cultural_compliance = cultural_compliance
            else:
                self.avg_cultural_compliance = (
                    self.avg_cultural_compliance * (self.total_requests - 1)
                    + cultural_compliance
                ) / self.total_requests

        if islamic_compliance > 0:
            if self.total_requests == 1:
                self.avg_islamic_compliance = islamic_compliance
            else:
                self.avg_islamic_compliance = (
                    self.avg_islamic_compliance * (self.total_requests - 1)
                    + islamic_compliance
                ) / self.total_requests

        if arabic_accuracy > 0:
            if self.total_requests == 1:
                self.avg_arabic_processing_accuracy = arabic_accuracy
            else:
                self.avg_arabic_processing_accuracy = (
                    self.avg_arabic_processing_accuracy * (self.total_requests - 1)
                    + arabic_accuracy
                ) / self.total_requests

    @property
    def success_rate(self) -> float:
        """Calculate agent success rate."""
        if self.total_requests == 0:
            return 0.0
        return self.successful_requests / self.total_requests

    @property
    def cultural_quality_score(self) -> float:
        """Calculate overall cultural quality score."""
        return (
            self.avg_cultural_compliance * 0.4
            + self.avg_islamic_compliance * 0.4
            + self.avg_arabic_processing_accuracy * 0.2
        )


class IraqiAgentFactory:
    """
    Factory for creating and managing Iraqi-enhanced PydanticAI agents.

    Provides centralized agent creation, configuration management,
    cultural intelligence sharing, and performance monitoring.
    """

    def __init__(self):
        self.agents: Dict[str, IraqiAgentInstance] = {}
        self.cultural_intelligence = IraqiCulturalIntelligence()
        self.factory_metrics = {
            "total_agents_created": 0,
            "active_agents": 0,
            "total_requests_processed": 0,
            "avg_cultural_compliance": 0.0,
            "factory_start_time": datetime.now(),
        }

        logger.info("✓ Iraqi Agent Factory initialized with cultural intelligence")

    def create_agent(
        self, config: IraqiAgentConfiguration, agent_id: Optional[str] = None
    ) -> str:
        """
        Create a new Iraqi agent with cultural intelligence.

        Args:
            config: Agent configuration with cultural settings
            agent_id: Optional custom agent ID

        Returns:
            Agent ID for future reference
        """
        try:
            creation_start = datetime.now()

            # Generate agent ID if not provided
            if agent_id is None:
                agent_id = f"{config.agent_type.value}_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"

            # Validate configuration
            self._validate_configuration(config)

            # Create cultural context if not provided
            if config.cultural_context is None:
                config.cultural_context = IraqiCulturalContext(
                    professional_domain=config.professional_domain.value,
                    arabic_processing_enabled=config.enable_arabic_processing,
                    cultural_validation_required=config.enable_cultural_intelligence,
                    professional_context=config.professional_context,
                )

            # Create agent based on type
            agent = self._create_agent_instance(config)

            # Create agent instance wrapper
            agent_instance = IraqiAgentInstance(
                agent_id=agent_id,
                agent=agent,
                configuration=config,
                created_at=creation_start,
            )

            # Register agent
            self.agents[agent_id] = agent_instance

            # Update factory metrics
            self.factory_metrics["total_agents_created"] += 1
            self.factory_metrics["active_agents"] += 1

            creation_time = (datetime.now() - creation_start).total_seconds() * 1000

            logger.info(
                f"✓ Created Iraqi {config.agent_type.value} agent '{agent_id}' "
                f"for {config.professional_domain.value} domain in {creation_time:.1f}ms"
            )

            return agent_id

        except Exception as e:
            logger.error(f"Failed to create Iraqi agent: {str(e)}")
            raise

    def get_agent(self, agent_id: str) -> Optional[IraqiBaseAgent]:
        """
        Get an agent by ID.

        Args:
            agent_id: Agent identifier

        Returns:
            Iraqi agent instance or None if not found
        """
        agent_instance = self.agents.get(agent_id)
        if agent_instance and agent_instance.is_active:
            return agent_instance.agent
        return None

    def get_agent_instance(self, agent_id: str) -> Optional[IraqiAgentInstance]:
        """
        Get full agent instance with metrics.

        Args:
            agent_id: Agent identifier

        Returns:
            Iraqi agent instance or None if not found
        """
        return self.agents.get(agent_id)

    def list_agents(
        self,
        agent_type: Optional[IraqiAgentType] = None,
        professional_domain: Optional[IraqiProfessionalDomain] = None,
        only_active: bool = True,
    ) -> List[str]:
        """
        List agents with optional filtering.

        Args:
            agent_type: Filter by agent type
            professional_domain: Filter by professional domain
            only_active: Only return active agents

        Returns:
            List of agent IDs matching criteria
        """
        matching_agents = []

        for agent_id, instance in self.agents.items():
            if only_active and not instance.is_active:
                continue

            if agent_type and instance.configuration.agent_type != agent_type:
                continue

            if (
                professional_domain
                and instance.configuration.professional_domain != professional_domain
            ):
                continue

            matching_agents.append(agent_id)

        return matching_agents

    def deactivate_agent(self, agent_id: str) -> bool:
        """
        Deactivate an agent (soft delete).

        Args:
            agent_id: Agent to deactivate

        Returns:
            True if agent was deactivated, False if not found
        """
        agent_instance = self.agents.get(agent_id)
        if agent_instance:
            agent_instance.is_active = False
            self.factory_metrics["active_agents"] -= 1
            logger.info(f"✓ Deactivated Iraqi agent '{agent_id}'")
            return True
        return False

    def remove_agent(self, agent_id: str) -> bool:
        """
        Completely remove an agent (hard delete).

        Args:
            agent_id: Agent to remove

        Returns:
            True if agent was removed, False if not found
        """
        if agent_id in self.agents:
            instance = self.agents[agent_id]
            if instance.is_active:
                self.factory_metrics["active_agents"] -= 1

            del self.agents[agent_id]
            logger.info(f"✓ Removed Iraqi agent '{agent_id}'")
            return True
        return False

    async def execute_agent_request(
        self,
        agent_id: str,
        user_prompt: str,
        deps: IraqiAgentDependencies,
        track_metrics: bool = True,
    ) -> Any:
        """
        Execute a request through an agent with metrics tracking.

        Args:
            agent_id: Agent to use
            user_prompt: User's prompt
            deps: Agent dependencies
            track_metrics: Whether to track performance metrics

        Returns:
            Agent response
        """
        agent_instance = self.agents.get(agent_id)
        if not agent_instance or not agent_instance.is_active:
            raise ValueError(f"Agent '{agent_id}' not found or inactive")

        execution_start = datetime.now()
        success = False
        cultural_compliance = 0.0
        islamic_compliance = 0.0
        arabic_accuracy = 0.0

        try:
            # Execute agent request
            result = await agent_instance.agent.run(user_prompt, deps)
            success = True

            # Extract cultural metrics if available
            if hasattr(result, "cultural_compliance_score"):
                cultural_compliance = result.cultural_compliance_score
            if hasattr(result, "islamic_compliance_score"):
                islamic_compliance = result.islamic_compliance_score
            if hasattr(result, "arabic_processing_accuracy"):
                arabic_accuracy = result.arabic_processing_accuracy

            return result

        except Exception as e:
            logger.error(f"Agent '{agent_id}' request failed: {str(e)}")
            raise

        finally:
            if track_metrics:
                execution_time = (
                    datetime.now() - execution_start
                ).total_seconds() * 1000

                # Update agent metrics
                agent_instance.update_metrics(
                    success=success,
                    response_time_ms=int(execution_time),
                    cultural_compliance=cultural_compliance,
                    islamic_compliance=islamic_compliance,
                    arabic_accuracy=arabic_accuracy,
                )

                # Update factory metrics
                self.factory_metrics["total_requests_processed"] += 1

    def get_agent_metrics(self, agent_id: str) -> Optional[Dict[str, Any]]:
        """
        Get performance metrics for a specific agent.

        Args:
            agent_id: Agent identifier

        Returns:
            Agent metrics dictionary or None if not found
        """
        agent_instance = self.agents.get(agent_id)
        if not agent_instance:
            return None

        return {
            "agent_id": agent_id,
            "agent_type": agent_instance.configuration.agent_type.value,
            "professional_domain": agent_instance.configuration.professional_domain.value,
            "created_at": agent_instance.created_at.isoformat(),
            "is_active": agent_instance.is_active,
            "last_used": agent_instance.last_used.isoformat()
            if agent_instance.last_used
            else None,
            # Performance metrics
            "total_requests": agent_instance.total_requests,
            "success_rate": round(agent_instance.success_rate, 3),
            "avg_response_time_ms": round(agent_instance.avg_response_time_ms, 1),
            # Cultural intelligence metrics
            "avg_cultural_compliance": round(agent_instance.avg_cultural_compliance, 3),
            "avg_islamic_compliance": round(agent_instance.avg_islamic_compliance, 3),
            "avg_arabic_processing_accuracy": round(
                agent_instance.avg_arabic_processing_accuracy, 3
            ),
            "cultural_quality_score": round(agent_instance.cultural_quality_score, 3),
        }

    def get_factory_metrics(self) -> Dict[str, Any]:
        """
        Get overall factory performance metrics.

        Returns:
            Factory metrics dictionary
        """
        active_agents = [
            instance for instance in self.agents.values() if instance.is_active
        ]

        # Calculate aggregated metrics
        if active_agents:
            avg_cultural_compliance = sum(
                instance.avg_cultural_compliance for instance in active_agents
            ) / len(active_agents)

            avg_islamic_compliance = sum(
                instance.avg_islamic_compliance for instance in active_agents
            ) / len(active_agents)

            avg_response_time = sum(
                instance.avg_response_time_ms for instance in active_agents
            ) / len(active_agents)

            total_success_rate = sum(
                instance.success_rate for instance in active_agents
            ) / len(active_agents)
        else:
            avg_cultural_compliance = 0.0
            avg_islamic_compliance = 0.0
            avg_response_time = 0.0
            total_success_rate = 0.0

        uptime = (
            datetime.now() - self.factory_metrics["factory_start_time"]
        ).total_seconds()

        return {
            "factory_uptime_seconds": int(uptime),
            "total_agents_created": self.factory_metrics["total_agents_created"],
            "active_agents_count": self.factory_metrics["active_agents"],
            "total_requests_processed": self.factory_metrics[
                "total_requests_processed"
            ],
            # Aggregated performance
            "avg_cultural_compliance": round(avg_cultural_compliance, 3),
            "avg_islamic_compliance": round(avg_islamic_compliance, 3),
            "avg_response_time_ms": round(avg_response_time, 1),
            "overall_success_rate": round(total_success_rate, 3),
            # Agent distribution
            "agents_by_type": self._get_agent_distribution_by_type(),
            "agents_by_domain": self._get_agent_distribution_by_domain(),
        }

    def _create_agent_instance(self, config: IraqiAgentConfiguration) -> IraqiBaseAgent:
        """Create the actual agent instance based on configuration."""

        agent_kwargs = {
            "model": config.model,
            "name": config.name,
            "retries": config.retries,
            "enable_rate_limiting": config.enable_rate_limiting,
            "enable_cultural_intelligence": config.enable_cultural_intelligence,
            "enable_arabic_processing": config.enable_arabic_processing,
            "cultural_compliance_threshold": config.cultural_compliance_threshold,
            "islamic_compliance_threshold": config.islamic_compliance_threshold,
        }

        # Create agent based on type
        if config.agent_type == IraqiAgentType.RAG_AGENT:
            return IraqiRagAgent(**agent_kwargs)

        # Add other agent types as they are implemented
        # elif config.agent_type == IraqiAgentType.CULTURAL_VALIDATOR:
        #     return IraqiCulturalValidator(**agent_kwargs)

        else:
            raise ValueError(f"Unsupported agent type: {config.agent_type}")

    def _validate_configuration(self, config: IraqiAgentConfiguration) -> None:
        """Validate agent configuration."""
        if not isinstance(config.agent_type, IraqiAgentType):
            raise ValueError("Invalid agent type")

        if not isinstance(config.professional_domain, IraqiProfessionalDomain):
            raise ValueError("Invalid professional domain")

        if (
            config.cultural_compliance_threshold < 0.0
            or config.cultural_compliance_threshold > 1.0
        ):
            raise ValueError(
                "Cultural compliance threshold must be between 0.0 and 1.0"
            )

        if (
            config.islamic_compliance_threshold < 0.0
            or config.islamic_compliance_threshold > 1.0
        ):
            raise ValueError("Islamic compliance threshold must be between 0.0 and 1.0")

    def _get_agent_distribution_by_type(self) -> Dict[str, int]:
        """Get count of agents by type."""
        distribution = {}
        for instance in self.agents.values():
            if instance.is_active:
                agent_type = instance.configuration.agent_type.value
                distribution[agent_type] = distribution.get(agent_type, 0) + 1
        return distribution

    def _get_agent_distribution_by_domain(self) -> Dict[str, int]:
        """Get count of agents by professional domain."""
        distribution = {}
        for instance in self.agents.values():
            if instance.is_active:
                domain = instance.configuration.professional_domain.value
                distribution[domain] = distribution.get(domain, 0) + 1
        return distribution


# Singleton factory instance
iraqi_agent_factory = IraqiAgentFactory()


# Convenience functions for common operations
def create_iraqi_rag_agent(
    professional_domain: IraqiProfessionalDomain = IraqiProfessionalDomain.GENERAL,
    model: str = "openai:gpt-4o-mini",
    agent_id: Optional[str] = None,
    **kwargs,
) -> str:
    """
    Convenience function to create an Iraqi RAG agent.

    Args:
        professional_domain: Professional domain specialization
        model: Model to use for the agent
        agent_id: Optional custom agent ID
        **kwargs: Additional configuration options

    Returns:
        Agent ID
    """
    config = IraqiAgentConfiguration(
        agent_type=IraqiAgentType.RAG_AGENT,
        professional_domain=professional_domain,
        model=model,
        **kwargs,
    )

    return iraqi_agent_factory.create_agent(config, agent_id)


def get_iraqi_agent(agent_id: str) -> Optional[IraqiBaseAgent]:
    """Get an Iraqi agent by ID."""
    return iraqi_agent_factory.get_agent(agent_id)


def execute_iraqi_agent(
    agent_id: str,
    user_prompt: str,
    deps: Optional[IraqiAgentDependencies] = None,
    **kwargs,
) -> Any:
    """
    Execute a request through an Iraqi agent.

    Args:
        agent_id: Agent identifier
        user_prompt: User's prompt
        deps: Agent dependencies
        **kwargs: Additional dependency parameters

    Returns:
        Agent response
    """
    if deps is None:
        deps = IraqiAgentDependencies(**kwargs)

    return asyncio.run(
        iraqi_agent_factory.execute_agent_request(agent_id, user_prompt, deps)
    )


__all__ = [
    "IraqiAgentFactory",
    "IraqiAgentConfiguration",
    "IraqiAgentInstance",
    "IraqiAgentType",
    "IraqiProfessionalDomain",
    "iraqi_agent_factory",
    "create_iraqi_rag_agent",
    "get_iraqi_agent",
    "execute_iraqi_agent",
]
