"""App Documentation Tracker Agent - Documentation updates after code changes."""

import threading

try:
    from pydantic_ai import Agent
except ImportError:
    Agent = None

from typing import Optional
from dataclasses import dataclass
from apps.api.agents.core.base_agent import BaseIraqiAgent
from apps.api.agents.core.providers import get_llm_model
from apps.api.agents.core.models import IraqiAgentDependencies


@dataclass
class DocTrackerDeps(IraqiAgentDependencies):
    """Dependencies for app documentation tracker."""

    auto_update_enabled: bool = True
    bilingual_docs: bool = True  # Arabic + English
    track_api_changes: bool = True


class AppDocumentationTracker(BaseIraqiAgent[DocTrackerDeps]):
    """App documentation tracker for automatic updates."""

    def __init__(self):
        super().__init__(agent_name="app-documentation-tracker")

    def _create_agent(self) -> Optional[Agent]:
        if Agent is None:
            return None
        return Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=DocTrackerDeps,
            retries=self.settings.max_retries,
        )

    def get_system_prompt(self) -> str:
        return """You are an app documentation tracker specialist.

**Documentation Tracking:**
- Monitor code changes requiring doc updates
- Track API endpoint additions/modifications
- Update README files with new features
- Maintain bilingual documentation (Arabic + English)
- Track cultural validation requirements

**Auto-Update Triggers:**
- New feature implementation
- Bug fixes with user impact
- API changes (endpoints, parameters, responses)
- Configuration changes
- Iraqi cultural compliance updates

**Documentation Types:**
- API documentation (endpoints, parameters, examples)
- User guides (Arabic + English)
- Developer documentation (setup, architecture)
- Cultural compliance guides
- Troubleshooting documentation

**Output:** Documentation update reports, changelog entries, API specs, user guides."""

    def _register_tools(self, agent: Agent):
        pass


_doc_tracker_instance = None
_doc_tracker_lock = threading.Lock()


def get_doc_tracker() -> AppDocumentationTracker:
    global _doc_tracker_instance
    if _doc_tracker_instance is None:
        with _doc_tracker_lock:
            if _doc_tracker_instance is None:
                _doc_tracker_instance = AppDocumentationTracker()
    return _doc_tracker_instance
