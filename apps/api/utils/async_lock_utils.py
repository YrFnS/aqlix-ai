"""
Async Lock Utilities

Provides thread-safe lazy initialization of asyncio.Lock instances
to prevent TOCTOU (Time-Of-Check-Time-Of-Use) race conditions.

Author: Iraqi AI Chat System
"""

import asyncio
import threading
from typing import Optional


class AsyncLockInitializer:
    """
    Thread-safe lazy initializer for asyncio.Lock instances

    Uses double-checked locking with a threading.Lock to prevent race conditions
    where multiple coroutines could create separate asyncio.Lock instances.

    Example:
        class MyClass:
            _lock: Optional[asyncio.Lock] = None
            _init_lock: AsyncLockInitializer = AsyncLockInitializer()

            def get_lock(self) -> asyncio.Lock:
                return self._init_lock.get_lock(lambda: self._lock, lambda v: setattr(self, '_lock', v))
    """

    def __init__(self):
        """Initialize the async lock initializer with a threading.Lock"""
        self._init_lock = threading.Lock()

    def get_lock(
        self,
        getter: callable,
        setter: callable,
    ) -> asyncio.Lock:
        """
        Get or create an asyncio.Lock instance with proper race protection

        Args:
            getter: Callable that returns the current lock value (or None)
            setter: Callable that accepts the created lock to store it

        Returns:
            asyncio.Lock instance (either existing or newly created)
        """
        # First check without lock (fast path)
        current_lock = getter()
        if current_lock is not None:
            return current_lock

        # Acquire initializer lock for thread-safe initialization
        with self._init_lock:
            # Double-check after acquiring lock
            current_lock = getter()
            if current_lock is None:
                # Create new asyncio.Lock
                current_lock = asyncio.Lock()
                setter(current_lock)

        return current_lock


# Convenience function for simpler usage
def create_async_lock_getter(cls, lock_attr_name: str, init_lock_attr_name: str):
    """
    Create a lock getter method for a class

    Args:
        cls: The class containing the lock
        lock_attr_name: Name of the attribute storing the asyncio.Lock
        init_lock_attr_name: Name of the attribute storing AsyncLockInitializer

    Returns:
        Function that can be used as a method to get the lock
    """

    def getter() -> asyncio.Lock:
        # Get the initializer from the class
        initializer = getattr(cls, init_lock_attr_name)
        # Get the current lock
        current_lock = getattr(cls, lock_attr_name, None)
        # Use the initializer
        return initializer.get_lock(
            lambda: getattr(cls, lock_attr_name, None),
            lambda lock: setattr(cls, lock_attr_name, lock),
        )

    return getter
