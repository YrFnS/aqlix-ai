"""External Service Coordinator - Service health monitoring."""

from apps.api.agents.coordination.service_coordinator.agent import (
    ExternalServiceCoordinator,
    get_service_coordinator,
    ServiceCoordinatorDeps,
)

__all__ = [
    "ExternalServiceCoordinator",
    "get_service_coordinator",
    "ServiceCoordinatorDeps",
]
