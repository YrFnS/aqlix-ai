"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createActionClient } from "@iraqi-ai/supabase-client/server";
import { isSupabaseConfigured } from "@/config/env";

const emailSchema = z
  .string()
  .trim()
  .min(1, "البريد الإلكتروني مطلوب / Email is required")
  .email("البريد الإلكتروني غير صحيح / Enter a valid email");

const passwordSchema = z
  .string()
  .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل / Use at least 8 characters")
  .max(72, "كلمة المرور طويلة جداً / Password is too long");

const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((input) => input.password === input.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين / Passwords do not match",
    path: ["confirmPassword"],
  });

export interface AccountActionState {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

export const initialAccountActionState: AccountActionState = {
  status: "idle",
};

function getFieldErrors(error: z.ZodError): Record<string, string[]> {
  return error.flatten().fieldErrors as Record<string, string[]>;
}

function getSafeNextPath(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "/workspaces";
  if (!value.startsWith("/") || value.startsWith("//")) return "/workspaces";
  return value;
}

async function getRequestOrigin(): Promise<string | null> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (!host) return null;

  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}

function configurationError(): AccountActionState {
  return {
    status: "error",
    message:
      "إعداد خدمة الحساب غير مكتمل بعد / Account service configuration is unavailable.",
  };
}

export async function signInAction(
  _previousState: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  if (!isSupabaseConfigured()) return configurationError();

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "راجع بيانات الدخول / Review the sign-in fields.",
      fieldErrors: getFieldErrors(parsed.error),
    };
  }

  const supabase = await createActionClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      status: "error",
      message:
        "تعذر تسجيل الدخول. تحقق من البريد وكلمة المرور / Sign-in failed. Check the email and password.",
    };
  }

  redirect(getSafeNextPath(formData.get("next")));
}

export async function signUpAction(
  _previousState: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  if (!isSupabaseConfigured()) return configurationError();

  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "راجع بيانات الحساب / Review the account fields.",
      fieldErrors: getFieldErrors(parsed.error),
    };
  }

  const nextPath = getSafeNextPath(formData.get("next"));
  const origin = await getRequestOrigin();
  const supabase = await createActionClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    ...(origin
      ? {
          options: {
            emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(nextPath)}`,
          },
        }
      : {}),
  });

  if (error) {
    return {
      status: "error",
      message:
        "تعذر إنشاء الحساب حالياً / The account could not be created right now.",
    };
  }

  if (data.session) {
    redirect(nextPath);
  }

  return {
    status: "success",
    message:
      "تحقق من بريدك لإكمال إنشاء الحساب / Check your email to finish creating the account.",
  };
}

export async function signOutAction(): Promise<never> {
  if (isSupabaseConfigured()) {
    const supabase = await createActionClient();
    await supabase.auth.signOut();
  }

  redirect("/login?status=signed-out");
}
