"use client";

import { useState } from "react";
import { ErrorBoundary } from "@/components/errors/error-boundary";
import { ErrorFallback } from "@/components/errors/error-fallback";
import { useAsyncError } from "@/hooks/use-async-error";

// Component that throws on click
function ThrowErrorButton() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("Test error: Rendering error triggered");
  }

  return (
    <button
      onClick={() => setShouldThrow(true)}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      Trigger Render Error
    </button>
  );
}

// Test async errors
function AsyncErrorTest() {
  const { error, handleAsyncError } = useAsyncError();

  const triggerAsyncError = async () => {
    await handleAsyncError(Promise.reject(new Error("Test async error")));
  };

  return (
    <div className="space-y-2">
      <button
        onClick={triggerAsyncError}
        className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
      >
        Trigger Async Error
      </button>
      {error && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  );
}

export default function TestErrorsPage() {
  return (
    <div className="container mx-auto p-8 space-y-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Error Handling Tests</h1>
        <p className="text-gray-600">
          Manual testing page for error boundaries and error handling
          mechanisms.
        </p>
      </div>

      <div className="space-y-6">
        {/* Error Boundary Test */}
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">1. Error Boundary Test</h2>
          <p className="text-sm text-gray-600 mb-4">
            This button triggers a rendering error that should be caught by the
            ErrorBoundary.
          </p>
          <ErrorBoundary
            fallback={(error, reset) => (
              <ErrorFallback error={error} reset={reset} />
            )}
          >
            <ThrowErrorButton />
          </ErrorBoundary>
        </div>

        {/* Async Error Test */}
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">2. Async Error Test</h2>
          <p className="text-sm text-gray-600 mb-4">
            This button triggers an async error using the useAsyncError hook.
          </p>
          <AsyncErrorTest />
        </div>

        {/* Instructions */}
        <div className="border rounded-lg p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            Testing Instructions
          </h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>
              • Click "Trigger Render Error" to test error boundary recovery
            </li>
            <li>• Click "Trigger Async Error" to test async error handling</li>
            <li>• Check browser console for error logs</li>
            <li>• Verify error messages differ in development vs production</li>
            <li>• Test "Try again" buttons to verify error recovery</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
