"use client";

/**
 * Basic Form Example
 *
 * Demonstrates simple form validation with react-hook-form and Zod.
 * Pattern for basic contact forms with text inputs.
 *
 * Features:
 * - Type-safe validation with Zod schema
 * - Accessible form controls with proper ARIA attributes
 * - Loading states during submission
 * - Success/error feedback
 * - Form reset after successful submission
 *
 * @example
 * <ExampleBasicForm />
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { emailSchema } from "@/lib/validation/common-schemas";

/**
 * Form schema definition with Zod
 * Defines validation rules for all form fields
 */
const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),
  email: emailSchema,
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must not exceed 1000 characters"),
});

/**
 * Infer TypeScript type from Zod schema
 * Provides type safety for form data
 */
type FormData = z.infer<typeof formSchema>;

/**
 * Basic Form Component
 * Simple contact form with validation and submission handling
 */
export function ExampleBasicForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  /**
   * Initialize form with react-hook-form
   * Uses zodResolver for Zod schema validation
   */
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  /**
   * Form submission handler
   * Simulates API call with loading states and feedback
   */
  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Form submitted:", data);

      setSubmitStatus({
        type: "success",
        message: "Message sent successfully! We'll get back to you soon.",
      });

      // Reset form on success
      form.reset();
    } catch (error) {
      console.error("Submission error:", error);

      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Contact Form</h2>
        <p className="text-muted-foreground">
          Basic form example with validation and error handling.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>Your full name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription>We'll never share your email</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message Field */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your message here..."
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Minimum 10 characters, maximum 1000 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Status Message */}
          {submitStatus && (
            <div
              className={`p-4 rounded-md ${
                submitStatus.type === "success"
                  ? "bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
              }`}
              role="alert"
            >
              {submitStatus.message}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Message"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setSubmitStatus(null);
              }}
              disabled={isLoading}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
