"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createActionClient } from "@iraqi-ai/supabase-client/server";
import { isSupabaseConfigured } from "@/config/env";

const emailSchema = z.string().trim().min(1).email();
const passwordSchema = z.string().min(8).max(72);

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
    path: ["confirmPassword"],
  });

function getSafeNextPath(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "/workspaces";
  if (!value.startsWith("/") || value.startsWith("//")) return "/workspaces";
  return value;
}

function accountRedirect(
  page: "/login" | "/register",
  status: string,
  nextPath: string,
): never {
  const params = new URLSearchParams({ status, next: nextPath });
  redirect(`${page}?${params.toString()}`);
}

async function getRequestOrigin(): Promise<string | null> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (!host) return null;

  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}

export async function signInAction(formData: FormData): Promise<never> {
  const nextPath = getSafeNextPath(formData.get("next"));

  if (!isSupabaseConfigured()) {
    accountRedirect("/login", "configuration", nextPath);
  }

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    accountRedirect("/login", "invalid-input", nextPath);
  }

  const supabase = await createActionClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    accountRedirect("/login", "invalid-credentials", nextPath);
  }

  redirect(nextPath);
}

export async function signUpAction(formData: FormData): Promise<never> {
  const nextPath = getSafeNextPath(formData.get("next"));

  if (!isSupabaseConfigured()) {
    accountRedirect("/register", "configuration", nextPath);
  }

  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    accountRedirect("/register", "invalid-input", nextPath);
  }

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
    accountRedirect("/register", "registration-failed", nextPath);
  }

  if (data.session) {
    redirect(nextPath);
  }

  accountRedirect("/login", "check-email", nextPath);
}

export async function signOutAction(): Promise<never> {
  if (isSupabaseConfigured()) {
    const supabase = await createActionClient();
    await supabase.auth.signOut();
  }

  redirect("/login?status=signed-out");
}
