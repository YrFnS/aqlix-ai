import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  createClient,
  type SupabaseServerClient,
} from "@iraqi-ai/supabase-client/server";
import { isSupabaseConfigured } from "@/config/env";

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

  const { data: assurance, error: assuranceError } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (assuranceError) {
    loginParams.set("status", "mfa-check-failed");
    redirect(`/login?${loginParams.toString()}`);
  }

  if (
    assurance.nextLevel === "aal2" &&
    assurance.currentLevel !== assurance.nextLevel
  ) {
    redirect(mfaChallengePath(returnTo));
  }

  return { user, supabase };
}
