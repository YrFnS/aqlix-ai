"""External Service Coordinator - Service health monitoring."""

from .agent import (
    ExternalServiceCoordinator,
    get_service_coordinator,
    ServiceCoordinatorDeps,
)

__all__ = [
    "ExternalServiceCoordinator",
    "get_service_coordinator",
    "ServiceCoordinatorDeps",
]
