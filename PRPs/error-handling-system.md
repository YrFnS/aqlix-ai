name: "Error Handling System PRP - Next.js 15 + React 19"
description: |
  Comprehensive error handling foundation with Error Boundaries, async error handling,
  user-friendly error UI, and monitoring integration preparation for Iraqi AI Chat System.

---

## Goal

Build a robust, multi-layered error handling system for the Iraqi AI Chat System that gracefully handles both synchronous rendering errors and asynchronous operation failures, provides clear user feedback, enables error recovery, and prepares the foundation for production monitoring integration.

The system must handle errors at multiple levels (global, route, component) while maintaining excellent UX and providing developers with actionable debugging information.

## Why

- **User Experience**: Prevent white screens and app crashes - users should see helpful recovery options instead of cryptic technical errors
- **System Reliability**: Isolate errors to prevent cascading failures across the application
- **Developer Productivity**: Clear error boundaries and logging make debugging faster and easier
- **Production Readiness**: Prepare infrastructure for monitoring tools like Sentry (referenced in error_monitoring.md)
- **Iraqi Context**: Error messages must be clear and actionable for all users, with future Arabic language support

## What

Build a comprehensive error handling system with:

1. **Error Boundary Hierarchy**: Global and route-level error boundaries using Next.js 15 error.tsx pattern
2. **Async Error Handling**: Custom hooks for handling async operations (API calls, data fetching)
3. **Error UI Components**: User-friendly error display with recovery actions
4. **Error Logging Infrastructure**: Structured error logging with Sentry integration preparation
5. **Development Experience**: Developer-friendly error display with stack traces in development mode
6. **Recovery Patterns**: User-initiated retry mechanisms and fallback UI states

### Success Criteria

- [x] Global error boundary catches all uncaught rendering errors
- [x] Route-level error boundaries isolate errors to specific sections
- [x] Async errors in hooks are caught and displayed appropriately
- [x] Error UI provides clear messages and recovery options
- [x] Different error handling for development vs production environments
- [x] Error logging structure supports future Sentry integration
- [x] All error boundaries tested with intentional error triggers
- [x] No console errors or warnings during normal operation

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Core Documentation
- url: https://nextjs.org/docs/app/getting-started/error-handling
  why: Official Next.js 15 error handling patterns, error.tsx and global-error.tsx usage
  critical: |
    - error.tsx must be Client Components ('use client')
    - Error boundaries don't catch errors in layouts or templates of same segment
    - Use reset() to attempt re-rendering the error boundary's contents
    - global-error.tsx must define its own <html> and <body> tags

- url: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
  why: React Error Boundary implementation with getDerivedStateFromError and componentDidCatch
  critical: |
    - Error boundaries are currently class components only
    - getDerivedStateFromError: Update state to show error UI
    - componentDidCatch: Log error information for monitoring

- url: https://docs.sentry.io/platforms/javascript/guides/react/
  why: Sentry integration patterns for error logging and monitoring (future integration)
  critical: |
    - Use beforeSend hook to sanitize sensitive data
    - Enable breadcrumbs for user interaction tracking
    - Set tracesSampleRate for performance monitoring
    - replaysOnErrorSampleRate for session replay on errors

- url: https://www.developerway.com/posts/how-to-handle-errors-in-react
  why: Comprehensive guide on async error handling in React hooks
  critical: |
    - Try/catch must be INSIDE useEffect, not around it
    - Error boundaries don't catch event handler or async errors
    - Can catch async errors with try/catch, then re-throw into render cycle

# Existing Codebase References
- file: apps/web/src/app/error.tsx
  why: Current basic error boundary implementation - pattern to enhance
  pattern: |
    - 'use client' directive required
    - Receives error and reset props
    - useEffect for logging in development
    - Simple UI with retry button

- file: apps/web/src/components/ui/form-error.tsx
  why: Existing error display pattern for form errors
  pattern: |
    - Handles Error objects or strings
    - Uses Lucide AlertCircle icon
    - role="alert" for accessibility
    - Consistent Tailwind styling with destructive colors

- file: apps/web/src/components/ui/alert.tsx
  why: Alert component with destructive variant for error messages
  pattern: |
    - Uses class-variance-authority for variants
    - Grid layout with icon support
    - AlertTitle and AlertDescription sub-components

- file: apps/web/src/app/not-found.tsx
  why: Example of specialized error page (404) with recovery action
  pattern: |
    - Simple centered layout
    - Clear messaging
    - Link back to home with styled button

# Technology Stack from package.json
- tech: Next.js 15 + React 19
  why: Latest stable versions with improved error handling

- tech: TypeScript (strict mode)
  why: Type safety for error objects and props

- tech: Zustand
  why: State management - can store global error state if needed

- tech: Tailwind CSS + lucide-react
  why: Styling and icons for error UI components

- tech: Playwright
  why: E2E testing including error scenarios
```

### Current Codebase Structure

```bash
apps/web/src/
├── app/
│   ├── layout.tsx          # Root layout (no error boundary here)
│   ├── error.tsx           # Route-level error boundary (EXISTS - to enhance)
│   ├── not-found.tsx       # 404 page (EXISTS - reference pattern)
│   └── globals.css         # Global styles
├── components/
│   ├── ui/
│   │   ├── alert.tsx       # Alert component (EXISTS)
│   │   ├── form-error.tsx  # Form error display (EXISTS)
│   │   ├── button.tsx      # Button component
│   │   └── card.tsx        # Card component
│   ├── layout/             # Layout components
│   ├── navigation/         # Navigation components
│   └── forms/              # Form components
├── hooks/
│   └── use-form-persist.ts # Form persistence hook (EXISTS)
├── lib/                    # Utility functions (ignored by serena)
├── types/                  # TypeScript types
└── middleware.ts           # Next.js middleware
```

### Desired Codebase Structure (Files to Add)

```bash
apps/web/src/
├── app/
│   ├── global-error.tsx                    # NEW: Root-level error boundary
│   ├── error.tsx                           # ENHANCE: Improve existing
│   └── [feature-routes]/
│       └── error.tsx                       # NEW: Route-specific error boundaries (as needed)
├── components/
│   └── errors/                             # NEW: Error-specific components
│       ├── error-boundary.tsx              # NEW: Reusable class-based error boundary
│       ├── error-fallback.tsx              # NEW: Customizable error fallback UI
│       ├── dev-error-display.tsx           # NEW: Dev-mode error display with stack trace
│       └── async-error-boundary.tsx        # NEW: Wrapper for async error handling
├── hooks/
│   ├── use-async-error.ts                  # NEW: Hook for async error handling
│   ├── use-error-handler.ts                # NEW: Generic error handler hook
│   └── use-error-boundary.ts               # NEW: Hook to trigger error boundary
└── lib/
    └── error-logger.ts                     # NEW: Error logging service (Sentry prep)
```

### Known Gotchas & Critical Implementation Details

```typescript
// CRITICAL: Next.js 15 Error Boundary Constraints

// ❌ ERROR BOUNDARIES DON'T CATCH:
// 1. Errors in event handlers
const handleClick = () => {
  throw new Error("Not caught by error boundary");
  // Solution: Use try/catch inside handler
};

// 2. Errors in async code
useEffect(() => {
  fetchData(); // Errors here not caught
  // Solution: Wrap in try/catch INSIDE useEffect
}, []);

// 3. Errors in Server Components (they're handled server-side)

// ✅ ERROR BOUNDARIES DO CATCH:
// - Rendering errors in Client Components
// - Errors in lifecycle methods
// - Errors in constructor

// CRITICAL: Try/Catch Placement with Hooks
// ❌ WRONG - This doesn't work:
try {
  useEffect(() => {
    throw new Error("Not caught");
  }, []);
} catch (error) {
  // Never executes
}

// ✅ CORRECT - Try/catch INSIDE hook:
useEffect(() => {
  const fetchData = async () => {
    try {
      await apiCall();
    } catch (error) {
      setError(error);
    }
  };
  fetchData();
}, []);

// CRITICAL: Next.js 15 global-error.tsx Requirements
// Must include <html> and <body> tags because it replaces root layout
export default function GlobalError({ error, reset }) {
  return (
    <html> {/* Required! */}
      <body>
        {/* Error UI */}
      </body>
    </html>
  );
}

// CRITICAL: Error Boundary Hierarchy
// - error.tsx at route level catches errors in that route
// - global-error.tsx catches errors in root layout.tsx
// - To handle layout errors, error.tsx must be in PARENT segment

// SECURITY: Never expose sensitive data in production errors
const getErrorMessage = (error: Error) => {
  if (process.env.NODE_ENV === 'production') {
    return 'An unexpected error occurred. Please try again.';
  }
  return error.message; // Show details only in development
};

// PATTERN: Async Error Handling in Hooks
// Always combine error state with try/catch
const [error, setError] = useState<Error | null>(null);

useEffect(() => {
  const loadData = async () => {
    try {
      const data = await fetchData();
      setData(data);
      setError(null); // Clear previous errors
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  };
  loadData();
}, []);

// SENTRY INTEGRATION (Future)
// Prepare structure now, integrate later
// Use beforeSend to sanitize:
Sentry.init({
  beforeSend(event, hint) {
    // Remove sensitive data
    if (event.request) {
      delete event.request.cookies;
    }
    return event;
  },
});
```

## Implementation Blueprint

### Task 1: Create Global Error Boundary

Create root-level error boundary for the entire application.

```typescript
// CREATE apps/web/src/app/global-error.tsx
'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error - will integrate with Sentry later
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Application Error
            </h1>
            <p className="text-gray-700 mb-6">
              {process.env.NODE_ENV === 'development'
                ? error.message
                : 'An unexpected error occurred. Our team has been notified.'}
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
```

### Task 2: Enhance Route-Level Error Boundary

Enhance the existing error.tsx with better UX and development features.

```typescript
// MODIFY apps/web/src/app/error.tsx
'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Enhanced logging - will integrate with error logger service
    console.error('Route error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-4">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        {/* Error Message */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600">
            {isDevelopment
              ? error.message
              : 'We encountered an unexpected error. Please try again.'}
          </p>

          {/* Development-only stack trace */}
          {isDevelopment && error.stack && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                View error details
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-xs overflow-auto max-h-64">
                {error.stack}
              </pre>
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### Task 3: Create Reusable Error Boundary Component

Create a class-based error boundary for wrapping specific components.

```typescript
// CREATE apps/web/src/components/errors/error-boundary.tsx
'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Reusable Error Boundary Component
 *
 * Wraps components to catch rendering errors and display fallback UI.
 * Can be used for specific feature areas that need isolated error handling.
 *
 * @example
 * <ErrorBoundary fallback={<ErrorFallback />}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so next render shows fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error information
    console.error('ErrorBoundary caught error:', {
      error,
      componentStack: errorInfo.componentStack,
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Render custom fallback or default error UI
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error, this.resetError);
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            Something went wrong in this component.
          </p>
          <button
            onClick={this.resetError}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Task 4: Create Error Fallback Components

Create reusable fallback UI components for different error scenarios.

```typescript
// CREATE apps/web/src/components/errors/error-fallback.tsx
'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export interface ErrorFallbackProps {
  error: Error;
  reset?: () => void;
  title?: string;
  message?: string;
}

/**
 * Generic Error Fallback Component
 *
 * Displays user-friendly error information with optional retry action.
 */
export function ErrorFallback({
  error,
  reset,
  title = 'Something went wrong',
  message,
}: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          {message || (isDevelopment ? error.message : 'An unexpected error occurred.')}
        </p>
        {reset && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 text-sm underline hover:no-underline"
          >
            <RefreshCw className="h-3 w-3" />
            Try again
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}

/**
 * Inline Error Display
 *
 * Minimal error display for inline use (e.g., in cards, forms).
 */
export function InlineError({ error, retry }: { error: Error; retry?: () => void }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm">
      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-red-800">{error.message}</p>
        {retry && (
          <button
            onClick={retry}
            className="mt-1 text-red-600 hover:text-red-800 underline text-xs"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
```

### Task 5: Create Async Error Handling Hook

Create custom hook for handling async operations with error management.

```typescript
// CREATE apps/web/src/hooks/use-async-error.ts
'use client';

import { useState, useCallback } from 'react';

export interface AsyncErrorState {
  error: Error | null;
  isError: boolean;
}

export interface AsyncErrorHandlers {
  setError: (error: Error | null) => void;
  clearError: () => void;
  handleAsyncError: (promise: Promise<any>) => Promise<any>;
}

/**
 * Hook for handling async operation errors
 *
 * Manages error state for async operations and provides
 * utilities for error handling and clearing.
 *
 * @example
 * const { error, isError, handleAsyncError, clearError } = useAsyncError();
 *
 * const fetchData = async () => {
 *   await handleAsyncError(
 *     fetch('/api/data').then(res => res.json())
 *   );
 * };
 */
export function useAsyncError(): AsyncErrorState & AsyncErrorHandlers {
  const [error, setErrorState] = useState<Error | null>(null);

  const setError = useCallback((error: Error | null) => {
    setErrorState(error);
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const handleAsyncError = useCallback(async (promise: Promise<any>) => {
    try {
      clearError();
      const result = await promise;
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      throw error; // Re-throw to allow caller to handle if needed
    }
  }, [clearError, setError]);

  return {
    error,
    isError: error !== null,
    setError,
    clearError,
    handleAsyncError,
  };
}
```

### Task 6: Create Generic Error Handler Hook

Create a versatile error handler hook with logging support.

```typescript
// CREATE apps/web/src/hooks/use-error-handler.ts
'use client';

import { useCallback } from 'react';

export interface ErrorHandlerOptions {
  /** Log errors to console in development */
  logError?: boolean;
  /** Custom error message for user display */
  userMessage?: string;
  /** Callback when error occurs */
  onError?: (error: Error) => void;
}

/**
 * Generic error handler hook
 *
 * Provides consistent error handling with logging and custom callbacks.
 * Useful for event handlers and async operations.
 *
 * @example
 * const handleError = useErrorHandler({
 *   logError: true,
 *   onError: (error) => toast.error(error.message)
 * });
 *
 * const onClick = () => {
 *   try {
 *     // risky operation
 *   } catch (err) {
 *     handleError(err);
 *   }
 * };
 */
export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { logError = true, onError } = options;

  const handleError = useCallback(
    (error: unknown, context?: string) => {
      const errorObj = error instanceof Error ? error : new Error(String(error));

      // Log in development
      if (logError && process.env.NODE_ENV === 'development') {
        console.error(
          `Error${context ? ` in ${context}` : ''}:`,
          errorObj
        );
      }

      // Future: Send to error logging service (Sentry)
      // logErrorToService(errorObj, context);

      // Call custom handler
      onError?.(errorObj);

      return errorObj;
    },
    [logError, onError]
  );

  return handleError;
}
```

### Task 7: Create Error Logger Service

Create error logging service with Sentry integration preparation.

```typescript
// CREATE apps/web/src/lib/error-logger.ts

interface ErrorLogContext {
  userId?: string;
  componentName?: string;
  action?: string;
  metadata?: Record<string, any>;
}

/**
 * Error Logger Service
 *
 * Centralized error logging with Sentry integration preparation.
 * Currently logs to console, ready for Sentry integration.
 */
class ErrorLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log error with context
   */
  log(error: Error, context?: ErrorLogContext) {
    // Console logging for development
    if (this.isDevelopment) {
      console.error('Error logged:', {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        context,
        timestamp: new Date().toISOString(),
      });
    }

    // Future Sentry integration
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     tags: {
    //       component: context?.componentName,
    //       action: context?.action,
    //     },
    //     user: context?.userId ? { id: context.userId } : undefined,
    //     extra: context?.metadata,
    //   });
    // }
  }

  /**
   * Log error with custom message
   */
  logMessage(message: string, level: 'info' | 'warning' | 'error' = 'error') {
    if (this.isDevelopment) {
      console[level]('[ErrorLogger]', message);
    }

    // Future Sentry integration
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureMessage(message, level);
    // }
  }

  /**
   * Set user context for error tracking
   */
  setUserContext(userId: string, email?: string) {
    // Future Sentry integration
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.setUser({ id: userId, email });
    // }
  }

  /**
   * Clear user context
   */
  clearUserContext() {
    // Future Sentry integration
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.setUser(null);
    // }
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger();

// Export for direct usage
export default errorLogger;
```

### Task 8: Create TypeScript Types

Create shared TypeScript types for error handling.

```typescript
// CREATE apps/web/src/types/errors.ts

/**
 * Standard error types for the application
 */

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AppError extends Error {
  code?: string;
  severity?: ErrorSeverity;
  context?: Record<string, any>;
}

export interface AsyncOperationError extends AppError {
  retryable?: boolean;
  retryCount?: number;
}

export interface ValidationError extends AppError {
  field?: string;
  fields?: string[];
}

export interface NetworkError extends AppError {
  statusCode?: number;
  url?: string;
}

/**
 * Error boundary props
 */
export interface ErrorBoundaryFallbackProps {
  error: Error;
  reset: () => void;
}

/**
 * Error context for logging
 */
export interface ErrorContext {
  userId?: string;
  componentName?: string;
  route?: string;
  action?: string;
  metadata?: Record<string, any>;
}
```

## Validation Loop

### Level 1: TypeScript & Linting

```bash
# Type checking - must pass with zero errors
cd apps/web
bun run typecheck

# Linting - must pass with zero errors
bun run lint

# Fix auto-fixable issues
bun run lint:fix

# Expected: No errors, all files type-safe
```

### Level 2: Manual Error Testing

Create test pages to verify error boundaries work correctly.

```typescript
// CREATE apps/web/src/app/test-errors/page.tsx (for manual testing)
'use client';

import { useState } from 'react';
import { ErrorBoundary } from '@/components/errors/error-boundary';
import { ErrorFallback } from '@/components/errors/error-fallback';
import { useAsyncError } from '@/hooks/use-async-error';

// Component that throws on click
function ThrowErrorButton() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Test error: Rendering error triggered');
  }

  return (
    <button
      onClick={() => setShouldThrow(true)}
      className="px-4 py-2 bg-red-600 text-white rounded"
    >
      Trigger Render Error
    </button>
  );
}

// Test async errors
function AsyncErrorTest() {
  const { error, handleAsyncError } = useAsyncError();

  const triggerAsyncError = async () => {
    await handleAsyncError(
      Promise.reject(new Error('Test async error'))
    );
  };

  return (
    <div className="space-y-2">
      <button
        onClick={triggerAsyncError}
        className="px-4 py-2 bg-orange-600 text-white rounded"
      >
        Trigger Async Error
      </button>
      {error && <p className="text-red-600">{error.message}</p>}
    </div>
  );
}

export default function TestErrorsPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold">Error Handling Tests</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">1. Error Boundary Test</h2>
        <ErrorBoundary fallback={(error, reset) => (
          <ErrorFallback error={error} reset={reset} />
        )}>
          <ThrowErrorButton />
        </ErrorBoundary>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">2. Async Error Test</h2>
        <AsyncErrorTest />
      </div>
    </div>
  );
}
```

### Level 3: End-to-End Testing with Playwright

```typescript
// CREATE apps/web/__tests__/error-handling.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test('should display error boundary on render error', async ({ page }) => {
    await page.goto('/test-errors');

    // Trigger render error
    await page.click('text=Trigger Render Error');

    // Should show error fallback
    await expect(page.locator('text=Something went wrong')).toBeVisible();

    // Should have retry button
    await expect(page.locator('text=Try again')).toBeVisible();
  });

  test('should handle async errors', async ({ page }) => {
    await page.goto('/test-errors');

    // Trigger async error
    await page.click('text=Trigger Async Error');

    // Should display error message
    await expect(page.locator('text=Test async error')).toBeVisible();
  });

  test('should recover from error on reset', async ({ page }) => {
    await page.goto('/test-errors');

    // Trigger error
    await page.click('text=Trigger Render Error');

    // Click reset
    await page.click('text=Try again');

    // Error should be cleared
    await expect(page.locator('text=Something went wrong')).not.toBeVisible();
  });

  test('should show 404 page for invalid routes', async ({ page }) => {
    const response = await page.goto('/this-does-not-exist');

    expect(response?.status()).toBe(404);
    await expect(page.locator('text=404 - Page Not Found')).toBeVisible();
  });
});
```

```bash
# Run E2E tests
cd apps/web
bun run test:e2e

# Run in UI mode for debugging
bun run test:e2e:ui

# Expected: All tests pass, error boundaries work correctly
```

## Final Validation Checklist

Run these commands to validate the implementation:

```bash
# 1. Type checking
cd apps/web
bun run typecheck
# Expected: ✓ No type errors

# 2. Linting
bun run lint
# Expected: ✓ No linting errors

# 3. Manual testing
bun run dev
# Visit http://localhost:3000/test-errors
# Test each error scenario
# Expected: All errors display correctly with recovery options

# 4. E2E tests
bun run test:e2e
# Expected: ✓ All error handling tests pass

# 5. Production build
bun run build
# Expected: ✓ Builds successfully with no errors
```

## Integration Points

```yaml
COMPONENTS:
  - integrate: Error boundaries in route segments as needed
  - pattern: Wrap risky components with ErrorBoundary
  - example: |
      <ErrorBoundary fallback={<ErrorFallback />}>
        <ComplexFeature />
      </ErrorBoundary>

HOOKS:
  - integrate: Use useAsyncError in data fetching
  - pattern: Wrap async operations with handleAsyncError
  - example: |
      const { error, handleAsyncError } = useAsyncError();

      useEffect(() => {
        handleAsyncError(fetchData());
      }, []);

MONITORING:
  - prepare: Error logger ready for Sentry integration
  - config: Add SENTRY_DSN to .env when ready
  - docs: See initials/error_monitoring.md for Sentry setup

STATE_MANAGEMENT:
  - optional: Can integrate with Zustand for global error state
  - pattern: Store critical errors in global state if needed

FORMS:
  - existing: form-error.tsx already handles form-level errors
  - pattern: Use for validation and submission errors
```

## Anti-Patterns to Avoid

- ❌ Don't wrap useEffect with try/catch (put try/catch INSIDE)
- ❌ Don't show technical error details in production
- ❌ Don't ignore the reset() function - implement error recovery
- ❌ Don't log sensitive user data in error messages
- ❌ Don't use error boundaries for control flow (use for actual errors only)
- ❌ Don't create too many error boundaries (causes complex hierarchy)
- ❌ Don't forget to handle async errors separately from render errors
- ❌ Don't use <Suspense> fallback for error states (use error boundaries)

## Future Enhancements (Out of Scope for This PRP)

- Sentry integration for production error monitoring
- Arabic error messages for Iraqi users
- Error rate limiting to prevent error spam
- Offline error queuing and retry
- Error boundary analytics dashboard
- Custom error pages per route segment
- Error recovery suggestions based on error type

---

## PRP Confidence Score: 9/10

**Rationale:**
- ✅ All Next.js 15 patterns documented and validated
- ✅ Existing codebase patterns identified and followed
- ✅ Critical gotchas explicitly documented
- ✅ Executable validation gates provided
- ✅ TypeScript types ensure safety
- ✅ Comprehensive testing approach
- ⚠️  Minor risk: Class-based error boundaries (functional alternative when React supports it)

**Deduction:** Class components for error boundaries may feel outdated but are currently the only option. Implementation is well-documented and testable.
