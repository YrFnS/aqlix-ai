"""App Documentation Tracker - Documentation updates after code changes."""

from apps.api.agents.coordination.doc_tracker.agent import (
    AppDocumentationTracker,
    get_doc_tracker,
    DocTrackerDeps,
)

__all__ = ["AppDocumentationTracker", "get_doc_tracker", "DocTrackerDeps"]
