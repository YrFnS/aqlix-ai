import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  createClient,
  type SupabaseServerClient,
} from "@iraqi-ai/supabase-client/server";
import { isSupabaseConfigured } from "@/config/env";
import {
  getValidatedSessionAssurance,
  SessionAssuranceError,
} from "./assurance";

export interface AuthenticatedContext {
  user: User;
  supabase: SupabaseServerClient;
}

function mfaChallengePath(returnTo: string): string {
  const params = new URLSearchParams({ next: returnTo });
  return `/mfa?${params.toString()}`;
}

export async function getOptionalUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireAuthenticatedUser(
  returnTo = "/workspaces",
): Promise<AuthenticatedContext> {
  const loginParams = new URLSearchParams({ next: returnTo });

  if (!isSupabaseConfigured()) {
    loginParams.set("reason", "configuration");
    redirect(`/login?${loginParams.toString()}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(`/login?${loginParams.toString()}`);
  }

  try {
    const assurance = await getValidatedSessionAssurance(supabase, user);
    if (assurance.requiresChallenge) {
      redirect(mfaChallengePath(returnTo));
    }
  } catch (assuranceError) {
    if (assuranceError instanceof SessionAssuranceError) {
      loginParams.set("status", "mfa-check-failed");
      redirect(`/login?${loginParams.toString()}`);
    }
    throw assuranceError;
  }

  return { user, supabase };
}
