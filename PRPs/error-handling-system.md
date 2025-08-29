name: "Error Handling System PRP v1.0"
description: |
  Comprehensive error handling foundation for the Iraqi AI Chat System with React Error Boundaries, 
  user-friendly error UI, and robust error recovery patterns following Iraqi cultural guidelines.

---

## Goal
Build a comprehensive error handling system that provides graceful error recovery, user-friendly error messages, and robust Error Boundary patterns for the Iraqi AI Chat System, ensuring cultural appropriateness and excellent user experience.

## Why
- **Reliability**: Prevent entire application crashes from component errors, maintaining system stability
- **User Experience**: Provide clear, actionable error messages that help users understand and recover from errors
- **Iraqi Cultural Compliance**: Ensure error messaging respects Islamic values and Iraqi professional contexts
- **Developer Experience**: Establish consistent error handling patterns across the application
- **Monitoring Foundation**: Create structure that supports future error tracking and monitoring integration

## What
A beginner-friendly error handling system including React Error Boundaries, fallback UI components, error recovery mechanisms, and integration with existing shadcn/ui components.

### Success Criteria
- [ ] Error Boundaries catch component errors without crashing the app
- [ ] User-friendly fallback UI displays for error states
- [ ] Error recovery actions (retry, reset, navigate) work correctly
- [ ] Error messages are culturally appropriate and actionable
- [ ] Integration with existing Alert/Toast components works seamlessly
- [ ] All error handling follows Iraqi cultural guidelines from CLAUDE.md
- [ ] System supports both development and production error scenarios

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
  why: Core React Error Boundary concepts, lifecycle methods, and limitations
  
- url: https://github.com/bvaughn/react-error-boundary
  why: Modern functional component Error Boundary implementation patterns
  section: API documentation and examples
  critical: Supports hooks and function components vs class-only approach

- file: examples/dyad-extracted/components/ui/alert.tsx
  why: Existing Alert component pattern to follow for error display
  pattern: forwardRef, cn utility, variant system, displayName

- file: examples/dyad-extracted/components/ui/toast.tsx  
  why: Toast system for non-critical error notifications
  pattern: Provider/context pattern, action elements, styling approach

- file: examples/dyad-extracted/components/ui/button.tsx
  why: Button component patterns for error recovery actions
  pattern: Variant system, size handling, accessibility

- file: examples/dyad-extracted/components/ui/card.tsx
  why: Card layout patterns for error fallback containers
  pattern: Composable components (Header, Content, Footer)

- file: examples/dyad-extracted/components.json
  why: shadcn/ui configuration and alias setup
  
- file: CLAUDE.md
  why: Iraqi cultural compliance rules and agent delegation requirements
  section: Cultural Validation, Arabic Text Processing, Security Rules
  critical: 95%+ cultural appropriateness required, Islamic compliance mandatory
```

### Current Codebase Tree
```bash
examples/dyad-extracted/
├── components/
│   └── ui/
│       ├── alert.tsx           # Error display foundation
│       ├── toast.tsx           # Notification system  
│       ├── button.tsx          # Recovery actions
│       ├── card.tsx           # Container layouts
│       └── use-toast.ts       # Toast hook pattern
└── hooks/
    └── use-toast.ts           # State management pattern

PRPs/templates/
└── prp_base.md                # Template structure
```

### Desired Codebase Tree
```bash
components/ui/
├── error-boundary.tsx         # Core ErrorBoundary components  
├── error-fallback.tsx         # Fallback UI components
└── error-handler.tsx          # useErrorHandler hook

examples/error-handling/       # Implementation examples
├── app-level-boundary.tsx     # Top-level error boundary
├── route-level-boundary.tsx   # Route-specific boundaries  
├── component-level-boundary.tsx # Widget-level boundaries
└── development-errors.tsx     # Development-friendly errors

tests/
└── error-handling.test.tsx    # Comprehensive test suite
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: React Error Boundaries only work in client components
'use client'; // Required at top of files using Error Boundaries

// CRITICAL: Error Boundaries DON'T catch:
// - Errors in event handlers (use try-catch manually)
// - Async errors (need manual error boundaries with promises) 
// - Server-side rendering errors
// - Errors thrown in the Error Boundary itself

// CRITICAL: react-error-boundary requires installation
// bun add react-error-boundary

// CRITICAL: Next.js 15 + React 19 considerations
// - Must use 'use client' directive for Error Boundaries
// - Server components need different error handling approach

// CRITICAL: Iraqi Cultural Requirements
// - All error messages must be validated by iraqi-cultural-validator
// - RTL support required for Arabic error text
// - Islamic compliance required (no inappropriate language/imagery)

// CRITICAL: Security Requirements  
// - Never expose sensitive system information in production errors
// - Log errors without exposing user data or API keys
// - Sanitize error messages to prevent information leakage
```

## Implementation Blueprint

### Data Models and Structure
```typescript
// Core error types for type safety and consistency
export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
}

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  errorInfo?: ErrorInfo;
}

export interface ErrorBoundaryConfig {
  fallback: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
  isolateErrorBoundary?: boolean;
}
```

### List of Tasks (Implementation Order)

```yaml
Task 1: Install Dependencies
INSTALL react-error-boundary:
  - RUN: bun add react-error-boundary
  - RUN: bun add -D @types/react-error-boundary
  - VERIFY: Check package.json includes both dependencies

Task 2: Create Core Error Boundary Components
CREATE components/ui/error-boundary.tsx:
  - MIRROR pattern from: examples/dyad-extracted/components/ui/alert.tsx
  - USE: react-error-boundary library for modern implementation
  - INCLUDE: ErrorBoundary, ErrorFallback, withErrorBoundary HOC
  - PATTERN: forwardRef, cn utility, displayName, TypeScript interfaces
  - PRESERVE: shadcn/ui styling patterns and variant system

Task 3: Create Error Fallback UI Components  
CREATE components/ui/error-fallback.tsx:
  - MIRROR layout from: examples/dyad-extracted/components/ui/card.tsx
  - INTEGRATE: Alert component for error display
  - INTEGRATE: Button component for recovery actions
  - INCLUDE: Multiple fallback variants (minimal, detailed, custom)
  - PRESERVE: Iraqi cultural guidelines and RTL support

Task 4: Create Error Handler Hook
CREATE components/ui/error-handler.tsx:
  - MIRROR pattern from: examples/dyad-extracted/hooks/use-toast.ts
  - INCLUDE: useErrorHandler hook for manual error boundaries
  - INCLUDE: Error context provider for global error state
  - PATTERN: React context + reducer pattern like toast system

Task 5: Create Implementation Examples
CREATE examples/error-handling/app-level-boundary.tsx:
  - SHOW: Top-level Error Boundary wrapping entire app
  - INCLUDE: Global error handling and logging setup
  
CREATE examples/error-handling/route-level-boundary.tsx:
  - SHOW: Route-specific Error Boundaries for isolated failures
  - INCLUDE: Navigation recovery options
  
CREATE examples/error-handling/component-level-boundary.tsx:
  - SHOW: Widget-level boundaries for component isolation
  - INCLUDE: Graceful degradation patterns

CREATE examples/error-handling/development-errors.tsx:
  - SHOW: Development-friendly error display with stack traces
  - INCLUDE: Production vs development error handling differences

Task 6: Create Comprehensive Tests
CREATE tests/error-handling.test.tsx:
  - TEST: Error Boundary catches rendering errors
  - TEST: Fallback UI renders correctly  
  - TEST: Recovery actions work (retry, reset, navigate)
  - TEST: Error logging functions properly
  - TEST: Cultural compliance of error messages
  - PATTERN: Use existing test patterns from codebase

Task 7: Integration and Documentation  
MODIFY existing components as needed:
  - UPDATE: Root layout to include top-level Error Boundary
  - VERIFY: Integration with existing Alert/Toast systems
  - DOCUMENT: Usage examples and best practices
```

### Task 1 Pseudocode
```bash
# Install modern Error Boundary library
bun add react-error-boundary
bun add -D @types/react-error-boundary

# Verify installation
grep "react-error-boundary" package.json
```

### Task 2 Pseudocode  
```typescript
'use client';

// PATTERN: Follow shadcn/ui component structure
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { cn } from '@/lib/utils';

// CRITICAL: Use react-error-boundary for modern implementation
export function ErrorBoundary({ 
  children, 
  fallback = DefaultErrorFallback,
  onError,
  ...props 
}: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={fallback}
      onError={(error, errorInfo) => {
        // PATTERN: Log errors securely without sensitive data
        console.error('Error Boundary caught an error:', error);
        
        // CRITICAL: Call Iraqi cultural validator for error messages
        if (onError) onError(error, errorInfo);
      }}
      {...props}
    >
      {children}
    </ReactErrorBoundary>
  );
}

// PATTERN: Multiple error boundary variants like other shadcn components
export const withErrorBoundary = ReactErrorBoundary.withErrorBoundary;
```

### Task 3 Pseudocode
```typescript
// PATTERN: Combine Card + Alert + Button components
export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <Card className={cn("w-full max-w-md mx-auto border-destructive")}>
      <CardHeader>
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {/* CRITICAL: User-friendly message, no technical details */}
            We encountered an unexpected error. Please try again.
          </AlertDescription>
        </Alert>
      </CardHeader>
      <CardFooter className="flex gap-2">
        <Button onClick={resetErrorBoundary} variant="default">
          Try Again
        </Button>
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh Page
        </Button>
      </CardFooter>
    </Card>
  );
}

// CRITICAL: Must validate error messages with Iraqi cultural validator
// PATTERN: RTL support for Arabic error messages
```

### Integration Points
```yaml
ROOT LAYOUT:
  - wrap: "app/layout.tsx with top-level ErrorBoundary"
  - pattern: "Preserve existing providers and structure"
  
COMPONENTS:
  - integrate: "Alert component for error display styling"
  - integrate: "Toast system for non-critical error notifications"
  - integrate: "Button component for recovery actions"
  - integrate: "Card component for error container layouts"
  
HOOKS:
  - pattern: "Follow use-toast.ts pattern for error handler hook"
  - pattern: "Context provider for global error state"
  
STYLING:  
  - use: "Existing cn() utility for class merging"
  - follow: "shadcn/ui variant system for error types"
  - support: "RTL layout for Arabic error messages"
```

## Validation Loop

### Level 1: Syntax & Style  
```bash
# Run these FIRST - fix any errors before proceeding
bun run lint                    # ESLint for code quality
bun run typecheck              # TypeScript type checking

# Expected: No errors. If errors exist, READ them carefully and fix.
```

### Level 2: Unit Tests
```typescript
// CREATE tests/error-handling.test.tsx with comprehensive test cases:
describe('ErrorBoundary', () => {
  test('catches rendering errors and shows fallback', () => {
    const ThrowError = () => { throw new Error('Test error'); };
    
    render(
      <ErrorBoundary fallback={ErrorFallback}>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  test('recovery actions work correctly', () => {
    // Test retry functionality
    // Test page refresh functionality  
    // Test navigation recovery
  });

  test('error logging works without exposing sensitive data', () => {
    const consoleSpy = jest.spyOn(console, 'error');
    // Verify error logging behavior
  });

  test('cultural compliance of error messages', () => {
    // Verify error messages are culturally appropriate
    // Test RTL layout support
    // Test Arabic error message rendering
  });
});
```

```bash  
# Run and iterate until all tests pass:
bun test tests/error-handling.test.tsx
# If failing: Read error carefully, fix root cause, re-run (never mock to pass)
```

### Level 3: Integration Testing
```bash
# Start development server
bun run dev

# Manual testing scenarios:
# 1. Intentionally break a component to trigger Error Boundary
# 2. Verify fallback UI renders correctly 
# 3. Test recovery actions (retry, refresh, navigate)
# 4. Check browser console for proper error logging
# 5. Test different error boundary granularities (app/route/component level)

# Expected: Clean error recovery without app crashes
```

## Final Validation Checklist
- [ ] All tests pass: `bun test`
- [ ] No linting errors: `bun run lint` 
- [ ] No type errors: `bun run typecheck`
- [ ] Manual error boundary testing successful
- [ ] Error recovery actions work properly
- [ ] Error messages are culturally appropriate and user-friendly
- [ ] No sensitive information exposed in error displays
- [ ] RTL layout works for Arabic error messages
- [ ] Integration with existing Alert/Toast components verified
- [ ] Documentation includes usage examples

---

## Anti-Patterns to Avoid
- ❌ Don't use class components for Error Boundaries (use react-error-boundary)
- ❌ Don't expose technical error details to users in production
- ❌ Don't rely on Error Boundaries for async error handling
- ❌ Don't forget 'use client' directive for Error Boundary components  
- ❌ Don't skip cultural validation for error messages
- ❌ Don't create custom Error Boundary when react-error-boundary works
- ❌ Don't ignore security implications of error message content
- ❌ Don't forget RTL layout support for Arabic error text

---

**PRP Confidence Score: 9/10**

This PRP provides comprehensive context for one-pass implementation success through:
- Complete research of existing codebase patterns
- Modern react-error-boundary approach vs outdated class components  
- Integration with existing shadcn/ui component system
- Iraqi cultural compliance requirements and security considerations
- Executable validation commands specific to this codebase
- Clear task sequence with detailed pseudocode
- All major gotchas and limitations documented