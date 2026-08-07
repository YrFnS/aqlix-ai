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

  return { user, supabase };
}
