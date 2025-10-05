"use client";

/**
 * Advanced Validation Form Example
 *
 * Demonstrates complex validation patterns with Zod refine and superRefine.
 * Pattern for user registration forms with advanced validation requirements.
 *
 * Features:
 * - Password confirmation validation
 * - Conditional field validation (professional license requirement)
 * - Multiple custom validation rules with superRefine
 * - Real-time validation feedback
 * - Reserved username checking
 *
 * @example
 * <ExampleValidationForm />
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import {
  emailSchema,
  passwordSchema,
  usernameSchema,
} from "@/lib/validation/common-schemas";

/**
 * Reserved usernames that cannot be used
 */
const RESERVED_USERNAMES = [
  "admin",
  "root",
  "system",
  "moderator",
  "administrator",
];

/**
 * User type enum for conditional validation
 */
const UserType = z.enum(["regular", "professional"]);

/**
 * Advanced form schema with refine for conditional validation
 * Demonstrates password matching and professional license requirement
 */
const formSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    userType: UserType,
    licenseNumber: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      // Conditional validation: professionals must have license number
      if (data.userType === "professional") {
        return !!data.licenseNumber && data.licenseNumber.length > 0;
      }
      return true;
    },
    {
      message: "License number is required for professional accounts",
      path: ["licenseNumber"],
    },
  )
  .refine(
    (data) => {
      // Check username is not reserved
      return !RESERVED_USERNAMES.includes(data.username.toLowerCase());
    },
    {
      message: "This username is reserved. Please choose a different username.",
      path: ["username"],
    },
  );

/**
 * Alternative using superRefine for multiple validation rules
 * Uncomment to see superRefine pattern in action
 */
// const formSchemaWithSuperRefine = z
//   .object({
//     username: usernameSchema,
//     email: emailSchema,
//     password: passwordSchema,
//     confirmPassword: z.string(),
//     userType: UserType,
//     licenseNumber: z.string().optional(),
//   })
//   .superRefine((data, ctx) => {
//     // Check 1: Password match
//     if (data.password !== data.confirmPassword) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Passwords don't match",
//         path: ["confirmPassword"],
//       });
//     }
//
//     // Check 2: Conditional validation for professionals
//     if (data.userType === "professional" && !data.licenseNumber) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "License number is required for professional accounts",
//         path: ["licenseNumber"],
//       });
//     }
//
//     // Check 3: Reserved username check
//     if (RESERVED_USERNAMES.includes(data.username.toLowerCase())) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "This username is reserved",
//         path: ["username"],
//       });
//     }
//   });

type FormData = z.infer<typeof formSchema>;

export function ExampleValidationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "regular",
      licenseNumber: "",
    },
  });

  // Watch userType to show/hide license field conditionally
  const userType = form.watch("userType");

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Registration submitted:", {
        ...data,
        password: "[REDACTED]",
        confirmPassword: "[REDACTED]",
      });

      setSubmitStatus({
        type: "success",
        message:
          "Registration successful! Please check your email to verify your account.",
      });

      form.reset();
    } catch (error) {
      console.error("Submission error:", error);

      setSubmitStatus({
        type: "error",
        message: "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">User Registration</h2>
        <p className="text-muted-foreground">
          Advanced validation example with password confirmation and conditional
          fields.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormDescription>
                  3-20 characters, alphanumeric with underscores and hyphens
                </FormDescription>
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
                <FormDescription>
                  We'll send a verification link to this email
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormDescription>
                  Minimum 8 characters with uppercase, lowercase, and number
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormDescription>Re-enter your password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* User Type Field */}
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Type</FormLabel>
                <FormControl>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="regular"
                        checked={field.value === "regular"}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="cursor-pointer"
                      />
                      <span>Regular User</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="professional"
                        checked={field.value === "professional"}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="cursor-pointer"
                      />
                      <span>Professional</span>
                    </label>
                  </div>
                </FormControl>
                <FormDescription>
                  Professionals require license verification
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Conditional License Number Field */}
          {userType === "professional" && (
            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Number</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC-123456" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your professional license number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
              {isLoading ? "Creating Account..." : "Create Account"}
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
