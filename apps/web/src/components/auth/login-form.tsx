"use client";

import Link from "next/link";
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

  const isEnglishOnly = culturalMode === "en-US";
  const isArabicOnly = culturalMode === "ar-IQ";
  const copy = (arabic: string, english: string) => {
    if (isEnglishOnly) return english;
    if (isArabicOnly) return arabic;
    return `${arabic} / ${english}`;
  };

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(undefined);

    const deviceData: SignInData = {
      ...values,
      deviceType: navigator.userAgent,
      platform: window.navigator.platform || "unknown",
      deviceId: localStorage.getItem("deviceId") || generateDeviceId(),
    };

    startTransition(async () => {
      try {
        const result = await signInAction(deviceData);

        if (!result.success) {
          setFormError(
            result.error ||
              "فشل تسجيل الدخول / Login failed. Please try again.",
          );
          return;
        }

        if (result.data?.requiresMfa) {
          router.push(`/auth/mfa-verify?setupId=${result.data.mfaSetupId}`);
          return;
        }

        if (onSuccess && result.data?.userId) {
          onSuccess(result.data.userId);
        }
        router.push(redirectTo);
      } catch {
        setFormError(
          "حدث خطأ في النظام / System error occurred. Please try again later.",
        );
      }
    });
  };

  return (
    <div
      className="w-full space-y-7"
      dir={isEnglishOnly ? "ltr" : "rtl"}
      lang={isEnglishOnly ? "en-US" : isArabicOnly ? "ar-IQ" : undefined}
    >
      <div className="space-y-3 text-center">
        <h1 className="font-arabic-heading text-3xl font-semibold tracking-tight">
          {copy("مرحباً بعودتك", "Welcome back")}
        </h1>
        <p className="text-sm leading-7 text-muted-foreground">
          {copy(
            "أدخل بياناتك للمتابعة إلى مساحة العمل",
            "Enter your details to continue to the workspace",
          )}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{copy("البريد الإلكتروني", "Email")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="name@example.com"
                    disabled={isPending}
                    autoComplete="email"
                    dir="ltr"
                    className="min-h-12 rounded-xl bg-card"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{copy("كلمة المرور", "Password")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    disabled={isPending}
                    autoComplete="current-password"
                    dir="ltr"
                    className="min-h-12 rounded-xl bg-card"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {formError && <FormError error={formError} />}

          <Button
            type="submit"
            className="min-h-12 w-full rounded-xl font-semibold"
            disabled={isPending}
          >
            {isPending
              ? copy("جاري تسجيل الدخول...", "Signing in...")
              : copy("تسجيل الدخول", "Sign in")}
          </Button>
        </form>
      </Form>

      <div className="space-y-3 text-center text-sm">
        <Link
          href="/password-reset"
          className="block font-medium text-primary hover:underline"
        >
          {copy("نسيت كلمة المرور؟", "Forgot your password?")}
        </Link>

        {showRegisterLink && (
          <p className="text-muted-foreground">
            {copy("ليس لديك حساب؟", "Don't have an account?")} {" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              {copy("إنشاء حساب", "Create account")}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

function generateDeviceId(): string {
  const deviceId = window.crypto?.randomUUID
    ? `device-${window.crypto.randomUUID()}`
    : `device-fallback-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

  localStorage.setItem("deviceId", deviceId);
  return deviceId;
}
