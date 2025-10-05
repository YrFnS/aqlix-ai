name: "Form Handling System - React Hook Form + Zod + shadcn/ui"
description: |
  Comprehensive form handling infrastructure for the Iraqi AI Chat System with type-safe validation,
  efficient state management, and accessible form patterns using react-hook-form, Zod, and shadcn/ui.

---

## Goal

Build a robust, accessible, and type-safe form handling foundation that provides:
- **Form State Management**: Efficient form state with react-hook-form (uncontrolled inputs, minimal re-renders)
- **Schema Validation**: Type-safe Zod schema validation with TypeScript integration
- **Reusable Components**: shadcn/ui-based form components following codebase patterns
- **Error Handling**: Comprehensive validation feedback and error display
- **Accessibility**: WCAG 2.1 AA compliant forms with proper ARIA attributes
- **Performance**: Optimized for large forms without performance degradation

## Why

- **User Experience**: Provides immediate validation feedback and clear error messages
- **Developer Experience**: Type-safe forms with minimal boilerplate and excellent autocompletion
- **Integration**: Seamlessly integrates with existing shadcn/ui component system
- **Cultural Support**: Foundation for future Arabic/RTL form enhancements
- **Maintainability**: Centralized validation logic with reusable schema patterns

## What

Create a complete form handling system that enables developers to:
1. Build validated forms with minimal code using shadcn/ui patterns
2. Define type-safe validation schemas with Zod
3. Handle complex validation scenarios (async, conditional, cross-field)
4. Display accessible error messages and validation feedback
5. Submit forms with proper error handling and loading states

### Success Criteria

- [ ] Form components installed and configured with shadcn/ui patterns
- [ ] Zod integration working with @hookform/resolvers
- [ ] Example forms demonstrating basic to advanced patterns
- [ ] TypeScript types properly inferred from Zod schemas
- [ ] Accessibility validation passing with screen readers
- [ ] Form submission handling with loading and error states
- [ ] Validation tests covering common scenarios
- [ ] Documentation with usage examples

## All Needed Context

### Documentation & References

```yaml
# OFFICIAL DOCUMENTATION - MUST READ
- url: https://react-hook-form.com/
  why: Core form state management API - focus on useForm, Controller, useFormContext
  critical: Uses uncontrolled inputs with ref for performance (not state-based)

- url: https://react-hook-form.com/get-started#Applyvalidation
  why: Validation patterns and error handling strategies

- url: https://zod.dev/
  why: Schema validation and TypeScript type inference
  section: Schema methods, refinements, transforms, error handling
  critical: Always use z.infer<typeof schema> for type safety

- url: https://ui.shadcn.com/docs/components/form
  why: Official shadcn/ui form component patterns
  critical: Form, FormField, FormItem, FormLabel, FormControl, FormMessage components

- url: https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html
  why: Accessible form patterns and ARIA requirements
  critical: Proper labeling, error announcements, keyboard navigation

- url: https://github.com/react-hook-form/resolvers#zod
  why: Zod resolver integration with react-hook-form

- url: https://wasp.sh/blog/2025/01/22/advanced-react-hook-form-zod-shadcn
  why: Advanced patterns - refine, superRefine, conditional validation (2025 best practices)

- url: https://blog.logrocket.com/building-reusable-multi-step-form-react-hook-form-zod/
  why: Multi-step form patterns and form persistence

# CODEBASE PATTERNS - MUST FOLLOW
- file: examples/dyad-extracted/components/ui/form.tsx
  why: Reference implementation of shadcn/ui form components
  pattern: FormField, FormItem, FormLabel, FormControl, FormMessage structure

- file: apps/web/src/config/env.ts
  why: Existing Zod validation patterns in codebase
  pattern: Schema definition, validation error handling, type inference with z.infer

- file: examples/kortix-suna-extracted/frontend/basejump/new-invitation-form.tsx
  why: Form submission pattern with server actions and useFormState

- file: apps/web/src/components/ui/input.tsx
  why: Existing input component with aria-invalid support
  pattern: Error state styling, accessibility attributes

- file: apps/web/components.json
  why: shadcn/ui configuration - aliases, paths, style settings
  critical: Use @/ prefix for imports, components in @/components/ui
```

### Current Codebase Tree

```bash
apps/web/src/
├── components/
│   ├── ui/                    # shadcn/ui components (button, input, label, etc.)
│   │   ├── button.tsx         # ✅ Already exists
│   │   ├── input.tsx          # ✅ Already exists - has aria-invalid support
│   │   ├── label.tsx          # ✅ Already exists
│   │   ├── checkbox.tsx       # ✅ Already exists
│   │   └── [NEED TO ADD: form.tsx, textarea.tsx, select.tsx]
│   └── layout/                # Layout components
├── lib/
│   └── utils.ts               # ✅ cn() utility exists
├── hooks/                     # Custom hooks
└── config/
    └── env.ts                 # ✅ Zod validation example

# Dependencies (already installed in apps/web/package.json)
✅ react-hook-form: ^7.48.2
✅ zod: ^3.22.4
✅ @hookform/resolvers: ^3.3.2
✅ @radix-ui/react-label: (via shadcn/ui)
```

### Desired Codebase Tree (files to add)

```bash
apps/web/src/
├── components/
│   ├── ui/
│   │   ├── form.tsx              # NEW: shadcn/ui form components (Form, FormField, FormItem, etc.)
│   │   ├── textarea.tsx          # NEW: textarea with same styling as input
│   │   ├── select.tsx            # NEW: select dropdown (if not exists)
│   │   └── form-error.tsx        # NEW: reusable error display component
│   └── forms/                    # NEW: example form implementations
│       ├── example-basic-form.tsx       # Basic form with text inputs
│       ├── example-validation-form.tsx  # Advanced validation (refine, conditional)
│       └── example-async-form.tsx       # Async validation example
├── lib/
│   └── validation/               # NEW: validation utilities and schemas
│       ├── common-schemas.ts     # Reusable Zod schemas (email, phone, etc.)
│       └── form-utils.ts         # Form helper functions
└── hooks/
    └── use-form-persist.ts       # NEW: optional form persistence hook
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: react-hook-form patterns
// ✅ CORRECT: Uncontrolled inputs with register
const { register, handleSubmit } = useForm();
<input {...register("email")} />

// ❌ WRONG: Don't use controlled inputs unless necessary (causes re-renders)
<input value={email} onChange={e => setEmail(e.target.value)} />

// CRITICAL: Zod resolver integration
// ✅ CORRECT: Use zodResolver from @hookform/resolvers
import { zodResolver } from "@hookform/resolvers/zod";
const form = useForm({ resolver: zodResolver(formSchema) });

// CRITICAL: Type inference
// ✅ CORRECT: Infer types from Zod schema
const formSchema = z.object({ email: z.string().email() });
type FormData = z.infer<typeof formSchema>; // { email: string }

// ❌ WRONG: Don't duplicate type definitions
type FormData = { email: string }; // Redundant!

// GOTCHA: Zod transforms and defaults
// Transforms run AFTER validation, defaults run BEFORE
const schema = z.object({
  enabled: z.enum(["true", "false"])
    .transform(val => val === "true") // After validation
    .default("true")                  // Before validation
});

// GOTCHA: Error messages with Zod
// ✅ Option 1: Inline messages
z.string().min(1, "Name is required")

// ✅ Option 2: Custom error map (better for i18n)
z.string().min(1, { message: "Name is required" })

// CRITICAL: Accessibility requirements
// MUST include: htmlFor, aria-describedby, aria-invalid
<Label htmlFor="email">Email</Label>
<Input
  id="email"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? "email-error" : undefined}
/>
{errors.email && <p id="email-error">{errors.email.message}</p>}

// GOTCHA: Next.js 15 + React 19 patterns
// Use useFormState for server actions (not useFormStatus)
import { useFormState } from "react-dom";
const [state, formAction] = useFormState(serverAction, initialState);

// CRITICAL: Performance - watch() usage
// ❌ WRONG: Causes re-render on every field change
const values = watch();

// ✅ CORRECT: Watch specific fields only
const email = watch("email");
```

## Implementation Blueprint

### Data Models and Structure

```typescript
// apps/web/src/lib/validation/common-schemas.ts
// Reusable Zod schemas for common validations

import { z } from "zod";

// Email validation with custom error
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address");

// Password validation with strength requirements
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// Phone number (international format)
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number");

// Iraqi phone number (specific format)
export const iraqiPhoneSchema = z
  .string()
  .regex(/^(?:\+964|00964|0)?7[3-9]\d{8}$/, "Invalid Iraqi phone number");

// URL validation
export const urlSchema = z.string().url("Invalid URL");

// Future: Arabic name validation
export const arabicNameSchema = z
  .string()
  .min(1, "Name is required")
  .regex(/^[\u0600-\u06FF\s]+$/, "Name must be in Arabic");
```

```typescript
// apps/web/src/components/ui/form.tsx
// shadcn/ui form components (mirror from examples/dyad-extracted)

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = FormProvider;

// Type-safe form field context
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

// [... rest of form component implementation from dyad-extracted ...]
```

### List of Tasks (in order)

```yaml
Task 1: Install and Configure Form Components
  CREATE apps/web/src/components/ui/form.tsx:
    - COPY implementation from: examples/dyad-extracted/components/ui/form.tsx
    - VERIFY imports use @/ alias (matching components.json config)
    - EXPORT: Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription
    - PRESERVE: TypeScript generics for type safety
    - ENSURE: Accessibility attributes (aria-describedby, aria-invalid)

  CREATE apps/web/src/components/ui/textarea.tsx:
    - MIRROR pattern from: apps/web/src/components/ui/input.tsx
    - CHANGE: input tag to textarea
    - KEEP: Same styling classes, aria-invalid support, error states
    - ADD: rows prop with default value

  VERIFY apps/web/src/components/ui/select.tsx:
    - CHECK if select component exists (may be installed already)
    - IF NOT EXISTS: Install with `bunx shadcn@latest add select`

Task 2: Create Validation Utilities
  CREATE apps/web/src/lib/validation/common-schemas.ts:
    - DEFINE reusable Zod schemas (email, password, phone, URL)
    - INCLUDE Iraqi-specific schemas (iraqiPhoneSchema with +964 format)
    - ADD custom error messages for all validations
    - EXPORT all schemas for reuse across forms
    - PATTERN: Follow env.ts schema definition style

  CREATE apps/web/src/lib/validation/form-utils.ts:
    - CREATE helper: getFieldError(errors, fieldName) → error message or null
    - CREATE helper: formatZodError(error) → user-friendly error object
    - CREATE helper: createFormSchema(baseSchema, conditionals) → schema with refinements
    - EXPORT FormFieldError type for consistent error handling

Task 3: Create Example Forms (Basic)
  CREATE apps/web/src/components/forms/example-basic-form.tsx:
    - IMPLEMENT: Simple contact form (name, email, message)
    - USE: react-hook-form with zodResolver
    - SCHEMA: Define formSchema with z.object
    - PATTERN: Form > form (HTML) > FormField > FormItem > FormLabel + FormControl + FormMessage
    - HANDLE: Submit with async function, loading state, success/error feedback
    - INCLUDE: TypeScript type inference from schema (type FormData = z.infer<typeof formSchema>)

Task 4: Create Example Forms (Advanced Validation)
  CREATE apps/web/src/components/forms/example-validation-form.tsx:
    - IMPLEMENT: User registration form with complex validation
    - FIELDS: username, email, password, confirmPassword
    - USE: Zod refine for password confirmation matching
    - USE: Zod superRefine for multiple custom validations
    - EXAMPLE conditional validation: if userType === "professional", require licenseNumber
    - DEMONSTRATE: Field-level and form-level error handling
    - PATTERN: Follow refine/superRefine patterns from 2025 best practices

Task 5: Create Example Forms (Async Validation)
  CREATE apps/web/src/components/forms/example-async-form.tsx:
    - IMPLEMENT: Form with async validation (e.g., check email uniqueness)
    - USE: Zod refine with async function
    - SIMULATE: API call to check if email exists (mock with setTimeout)
    - HANDLE: Loading state during async validation
    - SHOW: Debouncing to prevent excessive API calls
    - ERROR: Display async validation errors properly

Task 6: Create Form Error Component
  CREATE apps/web/src/components/ui/form-error.tsx:
    - REUSABLE component for displaying form-level errors
    - PROPS: error (string or Error object), className (optional)
    - STYLING: Match FormMessage styling (text-destructive)
    - ACCESSIBILITY: Include role="alert" for screen readers
    - ICON: Optional error icon using lucide-react

Task 7: Optional - Form Persistence Hook
  CREATE apps/web/src/hooks/use-form-persist.ts (optional):
    - HOOK: useFormPersist(form, storageKey)
    - SAVE: Form state to localStorage on change
    - RESTORE: Form state on mount
    - CLEAR: Utility to clear persisted data
    - DEBOUNCE: Save operations to prevent excessive writes
    - PATTERN: Based on multi-step form persistence patterns

Task 8: Create Test Page
  CREATE apps/web/src/app/examples/forms/page.tsx:
    - DISPLAY: All example forms in tabs or sections
    - PURPOSE: Manual testing and documentation
    - INCLUDE: Code snippets showing usage
    - LAYOUT: Use existing layout components (Container, Stack)

Task 9: Write Tests
  CREATE apps/web/src/components/forms/__tests__/form-validation.test.ts:
    - TEST: Zod schema validations (email, password, required fields)
    - TEST: Form submission with valid/invalid data
    - TEST: Error message display
    - TEST: Async validation scenarios
    - PATTERN: Use @testing-library/react for component tests
```

### Per-Task Pseudocode

```typescript
// Task 1: Form Component Setup
// Pattern: Wrapper around react-hook-form with accessibility

// form.tsx structure:
const Form = FormProvider; // Alias from react-hook-form

const FormField = <TFieldValues, TName>({...props}: ControllerProps) => {
  // Provides field context (name) to children
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);

  // Returns: id, name, error, isDirty, isTouched, invalid
  return { id, name: fieldContext.name, ...fieldState };
};

const FormItem = ({ children }) => {
  const id = useId(); // Unique ID for accessibility
  return (
    <FormItemContext.Provider value={{ id }}>
      <div className="space-y-2">{children}</div>
    </FormItemContext.Provider>
  );
};

const FormLabel = ({ children }) => {
  const { error, formItemId } = useFormField();
  // CRITICAL: htmlFor links to input ID, error styling
  return <Label htmlFor={formItemId} className={error && "text-destructive"}>{children}</Label>;
};

const FormControl = ({ children }) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  // CRITICAL: Slot passes props to child (register, aria attributes)
  return (
    <Slot
      id={formItemId}
      aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
    >
      {children}
    </Slot>
  );
};

const FormMessage = ({ children }) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message) : children;
  if (!body) return null;

  // CRITICAL: ID for aria-describedby, screen reader announcement
  return <p id={formMessageId} className="text-sm text-destructive">{body}</p>;
};
```

```typescript
// Task 3: Basic Form Implementation Pattern

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 1. Define schema with Zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// 2. Infer TypeScript type from schema
type FormData = z.infer<typeof formSchema>;

export function ExampleBasicForm() {
  // 3. Initialize form with zodResolver
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // 4. Submit handler with loading state
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      // PATTERN: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(data);
      toast.success("Form submitted successfully!");
      form.reset(); // Clear form on success
    } catch (error) {
      toast.error("Failed to submit form");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Repeat for email and message fields */}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
```

```typescript
// Task 4: Advanced Validation with refine/superRefine

const advancedFormSchema = z.object({
  username: z.string().min(3).max(20),
  email: emailSchema, // From common-schemas.ts
  password: passwordSchema,
  confirmPassword: z.string(),
  userType: z.enum(["regular", "professional"]),
  licenseNumber: z.string().optional(),
})
.refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // Error appears on confirmPassword field
})
.refine(data => {
  // Conditional validation: professionals must have license number
  if (data.userType === "professional") {
    return !!data.licenseNumber && data.licenseNumber.length > 0;
  }
  return true;
}, {
  message: "License number is required for professionals",
  path: ["licenseNumber"],
});

// ALTERNATIVE: superRefine for multiple errors
const superRefineSchema = baseSchema.superRefine((data, ctx) => {
  // Check 1: Password match
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });
  }

  // Check 2: Conditional validation
  if (data.userType === "professional" && !data.licenseNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "License number is required",
      path: ["licenseNumber"],
    });
  }

  // Check 3: Username availability (sync check only)
  if (RESERVED_USERNAMES.includes(data.username)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Username is reserved",
      path: ["username"],
    });
  }
});
```

```typescript
// Task 5: Async Validation Pattern

const asyncFormSchema = z.object({
  email: z.string().email(),
}).refine(async (data) => {
  // CRITICAL: This runs async validation
  const isAvailable = await checkEmailAvailability(data.email);
  return isAvailable;
}, {
  message: "Email is already taken",
  path: ["email"],
});

// Helper with debouncing
async function checkEmailAvailability(email: string): Promise<boolean> {
  // PATTERN: Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock: Check against existing emails
  const existingEmails = ["test@example.com", "admin@example.com"];
  return !existingEmails.includes(email);
}

// In component: Show loading state during async validation
const [isCheckingEmail, setIsCheckingEmail] = useState(false);

// Watch email field and debounce async validation
useEffect(() => {
  const subscription = form.watch(async (value, { name }) => {
    if (name === "email" && value.email) {
      setIsCheckingEmail(true);
      await form.trigger("email"); // Trigger validation
      setIsCheckingEmail(false);
    }
  });
  return () => subscription.unsubscribe();
}, [form.watch]);
```

### Integration Points

```yaml
UI Components Integration:
  - File: apps/web/src/components/ui/*.tsx
  - Pattern: Import and use in FormControl: <Input />, <Textarea />, <Select />
  - Ensure: All components support aria-invalid and error states

Validation Integration:
  - File: apps/web/src/lib/validation/common-schemas.ts
  - Pattern: Import schemas and compose with z.object()
  - Reuse: email, password, phone schemas across forms

Accessibility Integration:
  - Pattern: Every FormField must have FormLabel and FormMessage
  - Required: aria-describedby, aria-invalid on inputs
  - Testing: Verify with screen reader (NVDA/VoiceOver)

Error Tracking Integration (future):
  - Add: Sentry error tracking for validation failures
  - Track: Form submission errors and validation issues
  - Pattern: In onSubmit catch block, log to Sentry

Cultural Integration (future):
  - Prepare: RTL support in form layouts
  - Support: Arabic error messages (i18n ready)
  - Pattern: Use arabicNameSchema when ready
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - auto-fix what's possible
bun run lint
# Expected: No errors. If errors, READ and fix.

bun run typecheck
# Expected: No type errors. Common issues:
#   - Missing z.infer<typeof schema> type inference
#   - Incorrect form generic types
#   - Missing imports from react-hook-form
```

### Level 2: Component Tests

```typescript
// apps/web/src/components/forms/__tests__/form-validation.test.ts

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExampleBasicForm } from "../example-basic-form";

describe("Form Validation", () => {
  it("shows validation errors for empty required fields", async () => {
    render(<ExampleBasicForm />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    // Assert: Error messages appear
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email", async () => {
    render(<ExampleBasicForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, "invalid-email");

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const onSubmit = jest.fn();
    render(<ExampleBasicForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/name/i), "John Doe");
    await userEvent.type(screen.getByLabelText(/email/i), "john@example.com");
    await userEvent.type(screen.getByLabelText(/message/i), "This is a test message");

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        message: "This is a test message",
      });
    });
  });
});
```

```bash
# Run tests
bun test

# Run specific form tests
bun test form-validation

# Expected: All tests pass. If failing:
#   - Check Zod schema definitions
#   - Verify FormMessage displays errors
#   - Ensure handleSubmit is called correctly
```

### Level 3: Accessibility Tests

```bash
# Manual accessibility testing checklist:

1. Keyboard Navigation:
   - [ ] Tab through all form fields in logical order
   - [ ] Enter key submits form
   - [ ] Error messages receive focus when shown

2. Screen Reader Testing (NVDA/VoiceOver):
   - [ ] Labels announce correctly with fields
   - [ ] Error messages announce when validation fails
   - [ ] Required fields indicated properly
   - [ ] Form submission status announced

3. Visual Testing:
   - [ ] Error states visible (red border, error text)
   - [ ] Focus indicators clearly visible
   - [ ] Sufficient color contrast (WCAG AA)

4. Automated a11y testing:
   bun test:e2e -- --grep "accessibility"
   # Uses Playwright axe integration
```

### Level 4: Integration Test

```bash
# Start dev server
bun run dev

# Test form in browser
# Navigate to: http://localhost:3000/examples/forms

Manual Testing Checklist:
- [ ] Fill out basic form and submit
- [ ] Trigger validation errors by leaving fields empty
- [ ] Test invalid email format
- [ ] Test password confirmation mismatch
- [ ] Test async validation (email availability)
- [ ] Test form reset after successful submission
- [ ] Verify loading states during submission
- [ ] Check error states clear when corrected
```

## Final Validation Checklist

- [ ] All tests pass: `bun test`
- [ ] No linting errors: `bun run lint`
- [ ] No type errors: `bun run typecheck`
- [ ] Form components render correctly
- [ ] Validation errors display properly
- [ ] Error messages are user-friendly
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Form submission handles loading/error states
- [ ] Examples demonstrate basic to advanced patterns
- [ ] Code follows existing codebase patterns
- [ ] Documentation updated if needed

---

## Anti-Patterns to Avoid

- ❌ **Don't use controlled inputs** unless necessary (causes performance issues)
  - ✅ Instead: Use `register()` or `<Controller />` with `<FormControl />`

- ❌ **Don't duplicate type definitions** when you have Zod schemas
  - ✅ Instead: Use `type FormData = z.infer<typeof schema>`

- ❌ **Don't skip accessibility attributes** (aria-invalid, aria-describedby)
  - ✅ Instead: Use FormField, FormControl, FormMessage components

- ❌ **Don't watch entire form** with `watch()` (causes re-renders)
  - ✅ Instead: Watch specific fields: `watch("fieldName")`

- ❌ **Don't ignore Zod transform gotchas** (transforms run AFTER validation)
  - ✅ Instead: Order matters - validation → transform → default

- ❌ **Don't hardcode error messages** in multiple places
  - ✅ Instead: Define in Zod schema or common-schemas.ts

- ❌ **Don't mix validation libraries** (Yup + Zod in same form)
  - ✅ Instead: Use Zod consistently across the codebase

- ❌ **Don't skip loading states** during async operations
  - ✅ Instead: Always show loading feedback during submission/async validation

---

## Additional Notes

### Performance Considerations
- react-hook-form uses uncontrolled inputs (minimal re-renders)
- Only 8.6 kB minified + gzipped
- Avoid watching entire form state
- Use debouncing for async validations

### Future Enhancements
- Arabic/RTL form layouts (prepared structure)
- Multi-step form wizard component
- Form analytics and abandonment tracking
- Server-side validation integration with Next.js server actions
- Form persistence with localStorage hook
- Cultural validation for Iraqi-specific fields

### Common Use Cases
1. **Contact Forms**: Basic validation (name, email, message)
2. **User Registration**: Advanced validation (password match, async email check)
3. **Profile Updates**: Partial validation, optional fields
4. **Multi-step Wizards**: Form state persistence, progress tracking
5. **Dynamic Forms**: Conditional fields based on user selections

---

## Confidence Score: 9/10

**Reasoning:**
- ✅ All dependencies already installed (react-hook-form, zod, @hookform/resolvers)
- ✅ shadcn/ui configured and working (form pattern exists in examples)
- ✅ Existing Zod validation pattern in env.ts
- ✅ Existing UI components (input, label) ready to use
- ✅ Comprehensive documentation and best practices (2025 patterns)
- ✅ Clear implementation path with examples
- ⚠️ Minor risk: Potential accessibility edge cases need manual testing
- ⚠️ Async validation patterns may need iteration

**One-pass success probability**: 90% - Well-defined scope, existing patterns, comprehensive context
