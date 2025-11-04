"use client";

/**
 * Password Reset Page
 * Allows users to request password reset email
 */

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { resetPasswordAction } from "@/lib/auth/actions";

// Validation schema
const resetSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب / Email is required")
    .email("البريد الإلكتروني غير صحيح / Invalid email format"),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function PasswordResetPage() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | undefined>();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ResetFormValues) => {
    setFormError(undefined);

    startTransition(async () => {
      try {
        // Call actual password reset Server Action
        const result = await resetPasswordAction(values);

        if (result.success) {
          setIsSuccess(true);
        } else {
          setFormError(
            result.error ||
              "حدث خطأ في إرسال البريد / Failed to send reset email. Please try again.",
          );
        }
      } catch (error) {
        setFormError(
          "حدث خطأ في النظام / System error occurred. Please try again later.",
        );
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 text-center">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-6">
              <svg
                className="text-green-600 dark:text-green-400 h-16 w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h1 className="font-arabic text-2xl font-bold tracking-tight">
              <span className="block">تم إرسال رابط إعادة التعيين</span>
              <span className="text-muted-foreground block text-base font-normal">
                Reset Link Sent
              </span>
            </h1>
            <p className="text-muted-foreground font-arabic text-sm">
              تحقق من بريدك الإلكتروني للحصول على تعليمات إعادة تعيين كلمة
              المرور
              <br />
              Check your email for password reset instructions
            </p>
          </div>

          {/* Back to Login */}
          <Link href="/auth/login">
            <Button variant="outline" className="font-arabic w-full">
              العودة لتسجيل الدخول / Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="font-arabic text-2xl font-bold tracking-tight">
            <span className="block">إعادة تعيين كلمة المرور</span>
            <span className="text-muted-foreground block text-base font-normal">
              Reset Password
            </span>
          </h1>
          <p className="text-muted-foreground font-arabic text-sm">
            أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
            <br />
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {/* Reset Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-arabic">
                    البريد الإلكتروني / Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="name@example.com"
                      disabled={isPending}
                      autoComplete="email"
                      dir="ltr"
                    />
                  </FormControl>
                  <FormMessage className="font-arabic" />
                </FormItem>
              )}
            />

            {/* Form-level Error */}
            {formError && <FormError error={formError} />}

            {/* Submit Button */}
            <Button
              type="submit"
              className="font-arabic w-full"
              disabled={isPending}
            >
              {isPending
                ? "جاري الإرسال... / Sending..."
                : "إرسال رابط إعادة التعيين / Send Reset Link"}
            </Button>
          </form>
        </Form>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/auth/login"
            className="text-primary hover:underline font-arabic text-sm"
          >
            العودة لتسجيل الدخول / Back to Login
          </Link>
        </div>

        {/* Help Text */}
        <div className="bg-secondary rounded-lg p-4">
          <h3 className="font-arabic mb-2 text-sm font-semibold">
            مساعدة / Help
          </h3>
          <ul className="text-muted-foreground font-arabic space-y-1 text-xs">
            <li>
              • تأكد من استخدام البريد الإلكتروني المسجل / Use your registered
              email
            </li>
            <li>• تحقق من مجلد البريد غير المرغوب فيه / Check spam folder</li>
            <li>
              • رابط إعادة التعيين صالح لمدة ساعة واحدة / Reset link valid for 1
              hour
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
