"use client";

/**
 * Async Validation Form Example
 *
 * Demonstrates asynchronous validation with Zod refine.
 * Pattern for forms that need server-side validation (email uniqueness, username availability, etc.)
 *
 * Features:
 * - Async Zod refine for email uniqueness check
 * - Loading state during validation
 * - Debounced validation to prevent excessive API calls
 * - Real-time feedback during async validation
 * - Mock API call simulation
 *
 * @example
 * <ExampleAsyncForm />
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

/**
 * Mock function to check email availability
 * Simulates API call to check if email exists
 *
 * @param email - Email address to check
 * @returns Promise resolving to true if email is available
 */
async function checkEmailAvailability(email: string): Promise<boolean> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock existing emails
  const existingEmails = [
    "test@example.com",
    "admin@example.com",
    "user@example.com",
  ];

  return !existingEmails.includes(email.toLowerCase());
}

/**
 * Mock function to check username availability
 * Simulates API call to check if username exists
 *
 * @param username - Username to check
 * @returns Promise resolving to true if username is available
 */
async function checkUsernameAvailability(username: string): Promise<boolean> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Mock existing usernames
  const existingUsernames = ["admin", "test", "user", "moderator"];

  return !existingUsernames.includes(username.toLowerCase());
}

/**
 * Form schema with async validation
 * Uses Zod refine with async functions for server-side validation
 */
const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username must be alphanumeric")
    .refine(
      async (value) => {
        // Async validation: check username availability
        const isAvailable = await checkUsernameAvailability(value);
        return isAvailable;
      },
      {
        message:
          "Username is already taken. Please choose a different username.",
      },
    ),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .refine(
      async (value) => {
        // Async validation: check email availability
        const isAvailable = await checkEmailAvailability(value);
        return isAvailable;
      },
      {
        message: "Email is already registered. Please use a different email.",
      },
    ),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),
});

type FormData = z.infer<typeof formSchema>;

export function ExampleAsyncForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
    },
    mode: "onBlur", // Validate on blur to reduce async calls
  });

  /**
   * Watch for email changes and trigger validation
   * Uses debouncing to prevent excessive API calls
   */
  const email = form.watch("email");
  const username = form.watch("username");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (email && email.includes("@")) {
        setIsCheckingEmail(true);
        form.trigger("email").finally(() => setIsCheckingEmail(false));
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [email, form]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (username && username.length >= 3) {
        setIsCheckingUsername(true);
        form.trigger("username").finally(() => setIsCheckingUsername(false));
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [username, form]);

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Form submitted:", data);

      setSubmitStatus({
        type: "success",
        message: "Account created successfully! Welcome aboard.",
      });

      form.reset();
    } catch (error) {
      console.error("Submission error:", error);

      setSubmitStatus({
        type: "error",
        message: "Failed to create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Async Validation Example</h2>
        <p className="text-muted-foreground">
          Form with asynchronous validation for email and username uniqueness.
        </p>
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 rounded-md text-sm">
          <p className="font-semibold mb-1">Try these existing values:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Usernames: admin, test, user, moderator</li>
            <li>
              Emails: test@example.com, admin@example.com, user@example.com
            </li>
          </ul>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Field with Async Validation */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="johndoe" {...field} />
                    {isCheckingUsername && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  {isCheckingUsername
                    ? "Checking availability..."
                    : "Your unique username"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field with Async Validation */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                    {isCheckingEmail && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  {isCheckingEmail
                    ? "Checking availability..."
                    : "We'll verify this email is not already registered"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name Field (regular validation) */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>Your full name</FormDescription>
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
            <Button
              type="submit"
              disabled={isLoading || isCheckingEmail || isCheckingUsername}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
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
