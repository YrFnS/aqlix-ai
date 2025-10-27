"use client";

/**
 * Login Form Component with RTL Support
 * Features:
 * - Email/password authentication
 * - RTL layout for Arabic text
 * - Device tracking for multi-session support
 * - Cultural greeting after successful login
 * - Iraqi dialect validation messages
 */

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

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
import { signInAction, type SignInData } from "@/lib/auth/actions";

// Validation schema with Iraqi cultural considerations
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب / Email is required")
    .email("البريد الإلكتروني غير صحيح / Invalid email format"),
  password: z
    .string()
    .min(
      8,
      "كلمة المرور يجب أن تكون 8 أحرف على الأقل / Password must be at least 8 characters",
    ),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  redirectTo?: string;
  culturalMode?: "ar-IQ" | "en-US" | "both";
  showRegisterLink?: boolean;
  onSuccess?: (userId: string) => void;
}

export function LoginForm({
  redirectTo = "/dashboard",
  culturalMode = "both",
  showRegisterLink = true,
  onSuccess,
}: LoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | undefined>();
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [mfaSetupId, setMfaSetupId] = useState<string | undefined>();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(undefined);

    // Get device information for session tracking
    const deviceData: SignInData = {
      ...values,
      deviceType: navigator.userAgent,
      platform:
        typeof window !== "undefined" ? window.navigator.platform : "unknown",
      deviceId: localStorage.getItem("deviceId") || generateDeviceId(),
    };

    startTransition(async () => {
      try {
        const result = await signInAction(deviceData);

        if (result.success) {
          if (result.data?.requiresMfa) {
            // MFA required - redirect to MFA verification page
            setRequiresMfa(true);
            setMfaSetupId(result.data.mfaSetupId);
            router.push(`/auth/mfa-verify?setupId=${result.data.mfaSetupId}`);
          } else {
            // Login successful - callback and redirect
            if (onSuccess && result.data?.userId) {
              onSuccess(result.data.userId);
            }
            router.push(redirectTo);
          }
        } else {
          setFormError(
            result.error ||
              "فشل تسجيل الدخول / Login failed. Please try again.",
          );
        }
      } catch (error) {
        setFormError(
          "حدث خطأ في النظام / System error occurred. Please try again later.",
        );
      }
    });
  };

  return (
    <div
      className="w-full max-w-md space-y-6"
      dir={culturalMode === "ar-IQ" ? "rtl" : "ltr"}
    >
      {/* Cultural Greeting Header */}
      <div className="space-y-2 text-center">
        <h1 className="font-arabic text-2xl font-bold tracking-tight">
          {culturalMode === "en-US" ? (
            "Sign In"
          ) : culturalMode === "ar-IQ" ? (
            "تسجيل الدخول"
          ) : (
            <>
              <span className="block">السلام عليكم</span>
              <span className="text-muted-foreground block text-base">
                Welcome Back
              </span>
            </>
          )}
        </h1>
        <p className="text-muted-foreground text-sm">
          {culturalMode === "en-US"
            ? "Enter your credentials to access your account"
            : culturalMode === "ar-IQ"
              ? "أدخل بيانات الاعتماد للوصول إلى حسابك"
              : "أدخل بيانات الاعتماد للوصول إلى حسابك"}
        </p>
      </div>

      {/* Login Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-arabic">
                  {culturalMode === "en-US" ? (
                    "Email Address"
                  ) : culturalMode === "ar-IQ" ? (
                    "البريد الإلكتروني"
                  ) : (
                    <bdi>البريد الإلكتروني / Email</bdi>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder={
                      culturalMode === "en-US"
                        ? "name@example.com"
                        : "name@example.com"
                    }
                    disabled={isPending}
                    autoComplete="email"
                    dir="ltr" // Email always LTR
                  />
                </FormControl>
                <FormMessage className="font-arabic" />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-arabic">
                  {culturalMode === "en-US" ? (
                    "Password"
                  ) : culturalMode === "ar-IQ" ? (
                    "كلمة المرور"
                  ) : (
                    <bdi>كلمة المرور / Password</bdi>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    disabled={isPending}
                    autoComplete="current-password"
                    dir="ltr" // Password always LTR
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
            {isPending ? (
              culturalMode === "en-US" ? (
                "Signing in..."
              ) : culturalMode === "ar-IQ" ? (
                "جاري تسجيل الدخول..."
              ) : (
                <bdi>جاري تسجيل الدخول... / Signing in...</bdi>
              )
            ) : culturalMode === "en-US" ? (
              "Sign In"
            ) : culturalMode === "ar-IQ" ? (
              "تسجيل الدخول"
            ) : (
              <bdi>تسجيل الدخول / Sign In</bdi>
            )}
          </Button>
        </form>
      </Form>

      {/* Additional Links */}
      <div className="space-y-2 text-center text-sm">
        {/* Forgot Password Link */}
        <a
          href="/auth/password-reset"
          className="text-primary hover:underline font-arabic block"
        >
          {culturalMode === "en-US" ? (
            "Forgot your password?"
          ) : culturalMode === "ar-IQ" ? (
            "نسيت كلمة المرور؟"
          ) : (
            <bdi>نسيت كلمة المرور؟ / Forgot password?</bdi>
          )}
        </a>

        {/* Register Link */}
        {showRegisterLink && (
          <p className="text-muted-foreground font-arabic">
            {culturalMode === "en-US" ? (
              "Don't have an account? "
            ) : culturalMode === "ar-IQ" ? (
              "ليس لديك حساب؟ "
            ) : (
              <bdi>ليس لديك حساب؟ / Don't have an account? </bdi>
            )}
            <a
              href="/auth/register"
              className="text-primary hover:underline font-bold"
            >
              {culturalMode === "en-US" ? (
                "Register"
              ) : culturalMode === "ar-IQ" ? (
                "تسجيل حساب جديد"
              ) : (
                <bdi>تسجيل / Register</bdi>
              )}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Generate a unique device ID for session tracking
 * Stores in localStorage for multi-session support
 */
function generateDeviceId(): string {
  const deviceId = `device-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  if (typeof window !== "undefined") {
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
}
