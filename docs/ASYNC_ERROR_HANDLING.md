# Async Error Handling Guide

**Task 617**: Complete error handling for all async operations across the Iraqi AI Chat System.

## Overview

This document describes the comprehensive async error handling patterns implemented across the codebase to ensure robust, user-friendly error management and automatic recovery from transient failures.

## Architecture

### Web Application (React/Next.js)

**Location**: `apps/web/src/lib/async-error-handling.ts`

Core utilities for client-side async operations:

- **`retryAsync()`** - Retry with exponential backoff for transient failures
- **`withTimeout()`** - Wrap promises with timeout protection
- **`robustAsync()`** - Combines retry + timeout for maximum reliability
- **`handlePromiseError()`** - Structured error mapping and logging
- **`chainAsync()`** - Sequential operation execution with error handling
- **`parallelAsync()`** - Parallel execution with optional error collection
- **`createAsyncHandler()`** - Decorator for event handlers with automatic loading states

### React Hooks

**Location**: `apps/web/src/hooks/use-async-error.ts`

Enhanced error handling hook with retry/timeout capabilities:

```typescript
const {
  error,
  isError,
  isRetrying,
  handleAsyncError,
  handleWithRetry,
  handleWithTimeout,
  handleRobust
} = useAsyncError();
```

### Python API Backend

**Location**: `apps/api/services/async_error_handler.py`

Async error handling for FastAPI with similar patterns:

- **`retry_async()`** - Async retry with exponential backoff
- **`with_timeout()`** - Timeout wrapper for coroutines
- **`robust_async()`** - Combined retry + timeout
- **`async_error_handler`** - Decorator for async functions
- **`AsyncContextManager`** - Context manager for operation handling
- **`chain_operations()`** - Sequential async operation chaining
- **`parallel_operations()`** - Parallel async execution

## Usage Patterns

### Pattern 1: Simple Error Handling

**React:**
```typescript
const { error, handleAsyncError } = useAsyncError();

const fetchUser = async () => {
  try {
    const user = await handleAsyncError(
      fetch('/api/user').then(r => r.json())
    );
    setUser(user);
  } catch (err) {
    // Error already set in hook state
    showErrorToast(error?.message);
  }
};
```

**Python:**
```python
from services.async_error_handler import async_error_handler

@async_error_handler("fetch user profile")
async def get_user_profile(user_id: str):
    result = await db.query(f"SELECT * FROM users WHERE id = '{user_id}'")
    return result

# Usage
result = await get_user_profile("user-123")
if result.success:
    user = result.data
else:
    logger.error(f"Failed to fetch user: {result.error}")
```

### Pattern 2: Retry on Transient Failures

**React:**
```typescript
const { handleWithRetry } = useAsyncError();

const syncData = async () => {
  const result = await handleWithRetry(
    () => fetch('/api/sync').then(r => r.json()),
    {
      maxRetries: 3,
      initialDelayMs: 1000,
      backoffMultiplier: 2,
      onRetry: (attempt, error) => {
        console.warn(`Retry attempt ${attempt}: ${error.message}`);
      }
    }
  );
};
```

**Python:**
```python
from services.async_error_handler import retry_async, RetryConfig

async def sync_data():
    result = await retry_async(
        fetch_from_external_api,
        config=RetryConfig(
            max_retries=3,
            initial_delay_ms=1000,
            backoff_multiplier=2
        ),
        on_retry=lambda attempt, error: logger.warning(
            f"Retry attempt {attempt}: {error}"
        )
    )

    if result.success:
        process_data(result.data)
    else:
        logger.error(f"Failed after {result.attempts} attempts")
```

### Pattern 3: Timeout Protection

**React:**
```typescript
const { handleWithTimeout } = useAsyncError();

const fetchWithTimeout = async () => {
  try {
    const data = await handleWithTimeout(
      fetch('/api/large-operation').then(r => r.json()),
      5000 // 5 second timeout
    );
  } catch (err) {
    if (err.message.includes('timeout')) {
      showErrorToast('Operation took too long, please try again');
    }
  }
};
```

**Python:**
```python
from services.async_error_handler import with_timeout, TimeoutConfig

async def fetch_large_data():
    try:
        data = await with_timeout(
            expensive_operation(),
            config=TimeoutConfig(
                timeout_seconds=10.0,
                message="Operation exceeded 10 second timeout"
            )
        )
    except TimeoutError as e:
        logger.error(f"Timeout: {e}")
```

### Pattern 4: Robust Operations (Retry + Timeout)

**React:**
```typescript
const { handleRobust, isRetrying } = useAsyncError();

const robustFetch = async () => {
  const data = await handleRobust(
    () => fetch('/api/critical-data').then(r => r.json()),
    {
      retryOptions: {
        maxRetries: 3,
        initialDelayMs: 1000
      },
      timeoutOptions: {
        timeoutMs: 5000
      }
    }
  );

  if (data) {
    // Success
  } else if (isRetrying) {
    // Show loading state
  }
};
```

**Python:**
```python
from services.async_error_handler import robust_async, RetryConfig, TimeoutConfig

async def critical_operation():
    result = await robust_async(
        fetch_critical_data,
        retry_config=RetryConfig(max_retries=3),
        timeout_config=TimeoutConfig(timeout_seconds=5.0)
    )

    if result.success:
        return result.data
    else:
        raise Exception(f"Critical operation failed: {result.error}")
```

### Pattern 5: Sequential Operations

**React:**
```typescript
import { chainAsync } from '@/lib/async-error-handling';

const executeSequence = async () => {
  const result = await chainAsync([
    () => fetchUser(),
    () => fetchUserProfile(),
    () => fetchUserSettings()
  ], {
    continueOnError: false,
    onError: (error, index) => {
      logger.error(`Step ${index + 1} failed: ${error.message}`);
    }
  });

  if (result.success) {
    const [user, profile, settings] = result.results;
  } else {
    showErrorToast('Failed to load user data');
  }
};
```

**Python:**
```python
from services.async_error_handler import chain_operations

async def load_user_data():
    result = await chain_operations([
        lambda: get_user(),
        lambda: get_profile(),
        lambda: get_settings()
    ], continue_on_error=False)

    if result.success:
        user, profile, settings = result.data["results"]
    else:
        logger.error(f"Failed: {result.error}")
```

### Pattern 6: Parallel Operations

**React:**
```typescript
import { parallelAsync } from '@/lib/async-error-handling';

const loadDashboard = async () => {
  const result = await parallelAsync([
    () => fetchUsers(),
    () => fetchAnalytics(),
    () => fetchNotifications()
  ], {
    timeout: 5000,
    stopOnError: false
  });

  if (result.allSucceeded) {
    const [users, analytics, notifications] = result.results;
  } else {
    // Some operations failed
    const errors = result.results.filter(r => r instanceof Error);
    logger.warn(`${errors.length} operations failed`);
  }
};
```

**Python:**
```python
from services.async_error_handler import parallel_operations

async def load_dashboard():
    result = await parallel_operations([
        lambda: fetch_users(),
        lambda: fetch_analytics(),
        lambda: fetch_notifications()
    ], timeout_config=TimeoutConfig(timeout_seconds=5.0))

    if result.allSucceeded:
        users, analytics, notifications = result.data["results"]
    else:
        logger.warn(f"Some operations failed: {result.data['errors']}")
```

### Pattern 7: Async Event Handler

**React:**
```typescript
import { createAsyncHandler } from '@/lib/async-error-handling';

const handleSubmit = createAsyncHandler(
  async (formData) => {
    await submitForm(formData);
  },
  {
    onSuccess: () => {
      showSuccessToast('Form submitted successfully');
      navigateTo('/success');
    },
    onError: (error) => {
      showErrorToast(`Submission failed: ${error.message}`);
    },
    loading: setIsSubmitting,
    context: 'form submission'
  }
);

return <button onClick={() => handleSubmit(formData)} />;
```

## Error Detection and Recovery

### Transient Error Detection

Errors are classified as transient (retryable) if they match:

- **Network errors**: Connection refused, timeout, reset, unreachable host
- **Server errors**: 5xx HTTP status codes
- **Custom retryable errors**: Marked with `RetryableError` exception

### Backoff Strategy

Default exponential backoff configuration:

```
Attempt 1: 1000ms (1s)
Attempt 2: 2000ms (2s)
Attempt 3: 4000ms (4s)
Attempt 4: 8000ms (8s)
Attempt 5: 10000ms (10s) - capped at max_delay
```

Optional jitter reduces thundering herd:
```
delay = delay + random(0, delay * 0.1)
```

## Best Practices

### 1. Use `handleRobust` for Critical Operations

```typescript
// Good: Combines retry + timeout for critical paths
const result = await handleRobust(() => fetchCriticalData());

// Avoid: No retry mechanism
const result = await fetch('/api/critical');
```

### 2. Provide User-Friendly Messages

```typescript
// Good: User-friendly message
handleAsyncError(operation, {
  context: 'loading user profile',
  userMessage: 'Failed to load your profile. Please refresh the page.'
});

// Avoid: Technical error
showError(error.message); // "ECONNREFUSED: Connection refused"
```

### 3. Log with Context

```typescript
// Good: Contextual logging
logger.error('Email verification failed', {
  user_id: user.id,
  attempt: retryCount,
  duration_ms: 5000
});

// Avoid: Generic logging
logger.error('Error occurred');
```

### 4. Handle Timeout vs Network Error Differently

```typescript
try {
  await handleWithTimeout(operation, 5000);
} catch (err) {
  if (err.message.includes('timeout')) {
    showError('Operation is taking too long. Please try again.');
  } else {
    showError('Network error. Check your connection.');
  }
}
```

### 5. Don't Retry Non-Idempotent Operations

```typescript
// Good: Retryable (safe to retry multiple times)
const data = await handleWithRetry(() => fetch('/api/data'));

// Bad: Don't retry payment processing without idempotency key
const payment = await fetch('/api/payments', { method: 'POST' });
// Could charge customer multiple times!
```

### 6. Use Context Managers in Python

```python
# Good: Automatic error logging and resource cleanup
async with AsyncContextManager("database query") as ctx:
    try:
        result = await db.query(sql)
        ctx.success(result)
    except Exception as e:
        ctx.error(e)

# Avoid: Manual error handling
try:
    result = await db.query(sql)
except Exception as e:
    logger.error(f"Error: {e}")
```

## Configuration Reference

### Retry Configuration

```typescript
interface RetryOptions {
  maxRetries?: number;           // default: 3
  initialDelayMs?: number;       // default: 1000
  maxDelayMs?: number;           // default: 10000
  backoffMultiplier?: number;    // default: 2
  isRetryableError?: (err) => boolean;  // custom error check
  onRetry?: (attempt, error) => void;   // retry callback
}
```

### Timeout Configuration

```typescript
interface TimeoutOptions {
  timeoutMs?: number;       // default: 30000 (30 seconds)
  timeoutMessage?: string;  // custom error message
}
```

## Monitoring and Debugging

### Enable Debug Logging

```typescript
// React
const { handleWithRetry } = useAsyncError();
await handleWithRetry(operation, {
  onRetry: (attempt, error) => {
    console.warn(`Retry ${attempt}: ${error.message}`);
  }
});

// Python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Track Operation Metrics

```python
result = await robust_async(operation)
logger.info(f"Operation completed in {result.duration_ms}ms after {result.attempts} attempts")
```

### Error Reports

All errors include:
- **timestamp**: When error occurred
- **duration_ms**: How long operation ran
- **attempts**: Number of retry attempts made
- **error**: Exception details
- **context**: Operation name/context

## Migration Guide

### From `.catch()` to Structured Error Handling

**Before:**
```typescript
fetch('/api/data')
  .then(r => r.json())
  .catch(err => console.error(err)); // Silent failure
```

**After:**
```typescript
const { error, handleWithRetry } = useAsyncError();

const data = await handleWithRetry(
  () => fetch('/api/data').then(r => r.json()),
  { maxRetries: 3 }
);
```

### From Unhandled Promises to Wrapped Operations

**Before:**
```typescript
async function loadData() {
  const data = await fetch('/api/data').then(r => r.json()); // Unhandled rejection
}
```

**After:**
```typescript
async function loadData() {
  const result = await handleRobust(
    () => fetch('/api/data').then(r => r.json())
  );
  if (!result) showErrorToast('Failed to load data');
}
```

## Testing Async Error Handling

### Unit Test Example

```typescript
describe('async error handling', () => {
  it('should retry on network error', async () => {
    let attempts = 0;

    const result = await retryAsync(
      () => {
        attempts++;
        if (attempts < 3) throw new Error('Network error');
        return { success: true };
      },
      { maxRetries: 3 }
    );

    expect(result.success).toBe(true);
    expect(result.attempts).toBe(3);
  });
});
```

### Python Test Example

```python
import pytest
from services.async_error_handler import retry_async, RetryConfig

async def test_retry_on_transient_error():
    attempts = 0

    async def failing_operation():
        nonlocal attempts
        attempts += 1
        if attempts < 3:
            raise ConnectionError("Network error")
        return {"success": True}

    result = await retry_async(
        failing_operation,
        config=RetryConfig(max_retries=3)
    )

    assert result.success
    assert result.attempts == 3
```

## Performance Considerations

- **Retry delays**: Default backoff may cause slow recovery (total ~15s for 5 retries). Adjust `initialDelayMs` for faster recovery.
- **Timeout values**: Set appropriately for operation type:
  - API calls: 5-10s
  - Large uploads: 30-60s
  - Critical paths: Shorter timeouts to fail fast
- **Parallel operations**: All execute simultaneously but respect individual timeouts

## Related Documentation

- `docs/HOOKS_SETUP.md` - Claude Code hooks and automation
- `docs/CICD_ROADMAP.md` - CI/CD pipeline configuration
- `apps/web/src/lib/async-error-handling.ts` - React utilities source
- `apps/api/services/async_error_handler.py` - Python utilities source
- `apps/web/src/hooks/use-async-error.ts` - React hook source

## Summary

Task 617 implements comprehensive async error handling across the codebase:

✅ **Web App**: Retry, timeout, and robust utilities for React components
✅ **API Backend**: Async decorators and helpers for FastAPI routes
✅ **Retry Logic**: Exponential backoff with jitter for transient failures
✅ **Error Detection**: Classification of retryable vs permanent errors
✅ **User Experience**: User-friendly error messages and loading states
✅ **Monitoring**: Structured error logging with context and metrics

All async operations can now be executed with consistent error handling, automatic retry on transient failures, timeout protection, and clear error reporting.
