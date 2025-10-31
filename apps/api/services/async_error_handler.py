"""
Async Error Handling Utilities for Python FastAPI Backend

Provides comprehensive error handling for async operations with retry logic,
timeout management, and structured error responses.
"""

import asyncio
import logging
from typing import Callable, Optional, TypeVar, Any, Protocol
from dataclasses import dataclass
from datetime import datetime
from functools import wraps

logger = logging.getLogger(__name__)

T = TypeVar("T")


@dataclass
class AsyncResult:
    """Result wrapper for async operations"""

    success: bool
    data: Optional[Any] = None
    error: Optional[Exception] = None
    attempts: int = 1
    duration_ms: float = 0.0

    def to_dict(self) -> dict:
        """Convert to dictionary for API responses"""
        return {
            "success": self.success,
            "data": self.data,
            "error": str(self.error) if self.error else None,
            "attempts": self.attempts,
            "duration_ms": self.duration_ms,
        }


@dataclass
class RetryConfig:
    """Retry configuration for async operations"""

    max_retries: int = 3
    initial_delay_ms: float = 1000.0
    max_delay_ms: float = 10000.0
    backoff_multiplier: float = 2.0
    jitter: bool = True

    def get_delay(self, attempt: int) -> float:
        """Calculate delay for given attempt number with optional jitter"""
        delay = min(
            self.initial_delay_ms * (self.backoff_multiplier**attempt),
            self.max_delay_ms,
        )

        if self.jitter:
            import random

            jitter = random.uniform(0, delay * 0.1)
            delay += jitter

        return delay / 1000.0  # Convert to seconds for asyncio.sleep


@dataclass
class TimeoutConfig:
    """Timeout configuration"""

    timeout_seconds: float = 30.0
    message: str = "Operation timed out"


class RetryableError(Exception):
    """Marker exception for errors that should trigger retries"""

    pass


def is_network_error(error: Exception) -> bool:
    """Determine if error is a transient network error"""
    network_error_patterns = [
        "ConnectionError",
        "TimeoutError",
        "ConnectionResetError",
        "ConnectionAbortedError",
        "ConnectionRefusedError",
        "Network",
        "timeout",
        "temporary failure",
    ]

    error_str = f"{type(error).__name__}: {str(error)}"
    return any(pattern in error_str for pattern in network_error_patterns)


def is_server_error(error: Exception) -> bool:
    """Determine if error is a 5xx server error"""
    if hasattr(error, "status_code"):
        status = getattr(error, "status_code")
        if isinstance(status, int):
            return 500 <= status < 600
    return False


def is_retryable_error(error: Exception) -> bool:
    """Determine if error should trigger a retry"""
    return (
        is_network_error(error)
        or is_server_error(error)
        or isinstance(error, RetryableError)
    )


async def retry_async(
    operation: Callable[..., Any],
    *args,
    config: Optional[RetryConfig] = None,
    on_retry: Optional[Callable[[int, Exception], None]] = None,
    **kwargs,
) -> AsyncResult:
    """
    Retries an async operation with exponential backoff.

    Args:
        operation: Async function to execute
        args: Positional arguments for operation
        config: Retry configuration
        on_retry: Callback when retry occurs
        kwargs: Keyword arguments for operation

    Returns:
        AsyncResult with success status, data, and error information

    Example:
        ```python
        result = await retry_async(
            fetch_user_data,
            user_id,
            config=RetryConfig(max_retries=3),
            on_retry=lambda attempt, error: logger.warning(
                f"Retry attempt {attempt}: {error}"
            )
        )

        if result.success:
            user = result.data
        else:
            logger.error(f"Failed after {result.attempts} attempts: {result.error}")
        ```
    """
    config = config or RetryConfig()
    start_time = datetime.now()
    last_error: Optional[Exception] = None

    for attempt in range(config.max_retries + 1):
        try:
            # Call the operation
            if asyncio.iscoroutinefunction(operation):
                data = await operation(*args, **kwargs)
            else:
                data = operation(*args, **kwargs)

            duration_ms = (datetime.now() - start_time).total_seconds() * 1000
            return AsyncResult(
                success=True,
                data=data,
                attempts=attempt + 1,
                duration_ms=duration_ms,
            )

        except Exception as error:
            last_error = error
            logger.warning(f"Attempt {attempt + 1} failed: {error}")

            # Don't retry if error is not retryable or this was the last attempt
            if not is_retryable_error(error) or attempt == config.max_retries:
                duration_ms = (datetime.now() - start_time).total_seconds() * 1000
                return AsyncResult(
                    success=False,
                    error=error,
                    attempts=attempt + 1,
                    duration_ms=duration_ms,
                )

            # Calculate delay and retry
            delay = config.get_delay(attempt)

            if on_retry:
                on_retry(attempt + 1, error)

            logger.info(
                f"Retrying after {delay}s (attempt {attempt + 1}/{config.max_retries})"
            )
            await asyncio.sleep(delay)

    # Fallback (should not reach here)
    duration_ms = (datetime.now() - start_time).total_seconds() * 1000
    return AsyncResult(
        success=False,
        error=last_error or Exception("Unknown error"),
        attempts=config.max_retries + 1,
        duration_ms=duration_ms,
    )


async def with_timeout(
    coro,
    config: Optional[TimeoutConfig] = None,
) -> Any:
    """
    Wraps a coroutine with a timeout.

    Args:
        coro: Coroutine to execute
        config: Timeout configuration

    Returns:
        Result of coroutine

    Raises:
        asyncio.TimeoutError: If operation times out

    Example:
        ```python
        try:
            result = await with_timeout(
                fetch_data(),
                config=TimeoutConfig(timeout_seconds=5.0)
            )
        except asyncio.TimeoutError:
            logger.error("Operation timed out")
        ```
    """
    config = config or TimeoutConfig()

    try:
        return await asyncio.wait_for(coro, timeout=config.timeout_seconds)
    except asyncio.TimeoutError:
        raise asyncio.TimeoutError(config.message)


async def robust_async(
    operation: Callable[..., Any],
    *args,
    retry_config: Optional[RetryConfig] = None,
    timeout_config: Optional[TimeoutConfig] = None,
    **kwargs,
) -> AsyncResult:
    """
    Combines retry and timeout logic for robust async operations.

    Args:
        operation: Async function to execute
        args: Positional arguments
        retry_config: Retry configuration
        timeout_config: Timeout configuration
        kwargs: Keyword arguments

    Returns:
        AsyncResult with operation outcome

    Example:
        ```python
        result = await robust_async(
            fetch_from_external_api,
            endpoint="/users",
            retry_config=RetryConfig(max_retries=3),
            timeout_config=TimeoutConfig(timeout_seconds=10.0)
        )
        ```
    """

    async def wrapped_operation(*a, **kw):
        if timeout_config:
            return await with_timeout(operation(*a, **kw), timeout_config)
        else:
            if asyncio.iscoroutinefunction(operation):
                return await operation(*a, **kw)
            else:
                return operation(*a, **kw)

    return await retry_async(
        wrapped_operation,
        *args,
        config=retry_config,
        **kwargs,
    )


def async_error_handler(
    operation_name: str = "async operation",
    log_error: bool = True,
):
    """
    Decorator for async functions to provide consistent error handling.

    Args:
        operation_name: Name of operation for logging
        log_error: Whether to log errors

    Example:
        ```python
        @async_error_handler("fetch user data")
        async def get_user(user_id: str):
            response = await db.query(f"SELECT * FROM users WHERE id = {user_id}")
            return response

        result = await get_user("user-123")
        if result.success:
            user = result.data
        ```
    """

    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs) -> AsyncResult:
            start_time = datetime.now()

            try:
                data = await func(*args, **kwargs)
                duration_ms = (datetime.now() - start_time).total_seconds() * 1000

                return AsyncResult(
                    success=True,
                    data=data,
                    duration_ms=duration_ms,
                )

            except Exception as error:
                duration_ms = (datetime.now() - start_time).total_seconds() * 1000

                if log_error:
                    logger.error(
                        f"Error in {operation_name}: {error}",
                        exc_info=True,
                        extra={
                            "duration_ms": duration_ms,
                            "operation": operation_name,
                        },
                    )

                return AsyncResult(
                    success=False,
                    error=error,
                    duration_ms=duration_ms,
                )

        return wrapper

    return decorator


class AsyncContextManager:
    """
    Context manager for handling async operations with automatic error handling
    and resource cleanup.

    Example:
        ```python
        async with AsyncContextManager("database operation") as ctx:
            try:
                result = await db.query("SELECT * FROM users")
                ctx.success(result)
            except Exception as e:
                ctx.error(e)
        ```
    """

    def __init__(self, operation_name: str = "async operation"):
        self.operation_name = operation_name
        self.start_time = None
        self.result = None
        self._success = False
        self._error = None

    async def __aenter__(self):
        self.start_time = datetime.now()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        duration_ms = (datetime.now() - self.start_time).total_seconds() * 1000

        if exc_type is not None:
            logger.error(
                f"Error in {self.operation_name}: {exc_val}",
                exc_info=(exc_type, exc_val, exc_tb),
                extra={"duration_ms": duration_ms},
            )

        return False  # Don't suppress exceptions

    def success(self, data: Any = None):
        """Mark operation as successful"""
        self._success = True
        self.result = data

    def error(self, error: Exception):
        """Mark operation as failed"""
        self._success = False
        self._error = error

    def get_result(self) -> AsyncResult:
        """Get operation result"""
        duration_ms = (
            (datetime.now() - self.start_time).total_seconds() * 1000
            if self.start_time
            else 0
        )

        return AsyncResult(
            success=self._success,
            data=self.result,
            error=self._error,
            duration_ms=duration_ms,
        )


async def chain_operations(
    operations: list[Callable[[], Any]],
    continue_on_error: bool = False,
    timeout_config: Optional[TimeoutConfig] = None,
) -> AsyncResult:
    """
    Chains multiple async operations sequentially.

    Args:
        operations: List of async callables to execute
        continue_on_error: Continue if operation fails
        timeout_config: Timeout for each operation

    Returns:
        AsyncResult with aggregated results

    Example:
        ```python
        result = await chain_operations([
            lambda: fetch_user("user-123"),
            lambda: fetch_profile("user-123"),
            lambda: fetch_settings("user-123"),
        ])
        ```
    """
    start_time = datetime.now()
    results = []
    errors = []

    for i, operation in enumerate(operations):
        try:
            if timeout_config:
                data = await with_timeout(operation(), timeout_config)
            else:
                data = (
                    await operation()
                    if asyncio.iscoroutinefunction(operation)
                    else operation()
                )

            results.append(data)

        except Exception as error:
            logger.error(f"Operation {i + 1} failed: {error}", exc_info=True)
            errors.append(error)

            if not continue_on_error:
                duration_ms = (datetime.now() - start_time).total_seconds() * 1000
                return AsyncResult(
                    success=False,
                    error=error,
                    attempts=i + 1,
                    duration_ms=duration_ms,
                )

    duration_ms = (datetime.now() - start_time).total_seconds() * 1000

    return AsyncResult(
        success=len(errors) == 0,
        data={"results": results, "errors": errors},
        attempts=len(operations),
        duration_ms=duration_ms,
    )


async def parallel_operations(
    operations: list[Callable[[], Any]],
    stop_on_error: bool = False,
    timeout_config: Optional[TimeoutConfig] = None,
) -> AsyncResult:
    """
    Executes multiple async operations in parallel.

    Args:
        operations: List of async callables
        stop_on_error: Stop all if any operation fails
        timeout_config: Timeout for each operation

    Returns:
        AsyncResult with aggregated results

    Example:
        ```python
        result = await parallel_operations([
            lambda: fetch_users(),
            lambda: fetch_posts(),
            lambda: fetch_comments(),
        ])
        ```
    """
    start_time = datetime.now()

    async def safe_execute(op, idx):
        try:
            if timeout_config:
                return await with_timeout(op(), timeout_config)
            else:
                return await op() if asyncio.iscoroutinefunction(op) else op()
        except Exception as error:
            logger.error(f"Operation {idx + 1} failed: {error}", exc_info=True)

            if stop_on_error:
                raise

            return error

    try:
        results = await asyncio.gather(
            *[safe_execute(op, i) for i, op in enumerate(operations)],
            return_exceptions=not stop_on_error,
        )

        errors = [r for r in results if isinstance(r, Exception)]
        duration_ms = (datetime.now() - start_time).total_seconds() * 1000

        return AsyncResult(
            success=len(errors) == 0,
            data={
                "results": [r for r in results if not isinstance(r, Exception)],
                "errors": errors,
            },
            attempts=len(operations),
            duration_ms=duration_ms,
        )

    except Exception as error:
        duration_ms = (datetime.now() - start_time).total_seconds() * 1000
        return AsyncResult(
            success=False,
            error=error,
            attempts=len(operations),
            duration_ms=duration_ms,
        )
