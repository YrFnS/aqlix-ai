/**
 * Standard error types for the application
 */

export type ErrorSeverity = "low" | "medium" | "high" | "critical";

export interface AppError extends Error {
  code?: string;
  severity?: ErrorSeverity;
  context?: Record<string, unknown>;
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
  metadata?: Record<string, unknown>;
}
