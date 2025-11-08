import dynamic from "next/dynamic";

// Lazy load form components to improve initial page load performance
const ExampleBasicForm = dynamic(
  () =>
    import("@/components/forms/example-basic-form").then(
      (mod) => mod.ExampleBasicForm,
    ),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
  },
);

const ExampleValidationForm = dynamic(
  () =>
    import("@/components/forms/example-validation-form").then(
      (mod) => mod.ExampleValidationForm,
    ),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
  },
);

const ExampleAsyncForm = dynamic(
  () =>
    import("@/components/forms/example-async-form").then(
      (mod) => mod.ExampleAsyncForm,
    ),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
  },
);

export default function FormsExamplePage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Form Examples</h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive examples demonstrating form validation patterns with
          react-hook-form, Zod, and shadcn/ui.
        </p>
      </div>

      <div className="space-y-16">
        {/* Basic Form Example */}
        <section id="basic-form">
          <ExampleBasicForm />
        </section>

        <hr className="my-16 border-t border-border" />

        {/* Advanced Validation Form */}
        <section id="validation-form">
          <ExampleValidationForm />
        </section>

        <hr className="my-16 border-t border-border" />

        {/* Async Validation Form */}
        <section id="async-form">
          <ExampleAsyncForm />
        </section>
      </div>

      {/* Documentation Section */}
      <div className="mt-16 p-6 bg-muted/50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Form Patterns</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Basic Form</h3>
            <p className="text-sm text-muted-foreground">
              Simple contact form with text inputs and validation. Demonstrates
              basic Zod schema validation and error handling.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Advanced Validation</h3>
            <p className="text-sm text-muted-foreground">
              User registration with password confirmation and conditional
              fields. Uses Zod refine for complex validation rules.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Async Validation</h3>
            <p className="text-sm text-muted-foreground">
              Email uniqueness check with async validation. Demonstrates
              debouncing and loading states during server-side validation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
