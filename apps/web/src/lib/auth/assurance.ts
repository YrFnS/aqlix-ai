import "server-only";

import { Buffer } from "node:buffer";
import type { Session, User } from "@supabase/supabase-js";
import type { SupabaseServerClient } from "@iraqi-ai/supabase-client/server";

export type SessionAssuranceLevel = "aal1" | "aal2";

export interface SessionAssurance {
  currentLevel: SessionAssuranceLevel | null;
  hasVerifiedFactor: boolean;
  requiresChallenge: boolean;
}

export class SessionAssuranceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SessionAssuranceError";
  }
}

function accessTokenAssuranceLevel(
  accessToken: string,
): SessionAssuranceLevel | null {
  try {
    const encodedPayload = accessToken.split(".")[1];
    if (!encodedPayload) return null;

    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as { aal?: unknown };

    return payload.aal === "aal1" || payload.aal === "aal2"
      ? payload.aal
      : null;
  } catch {
    return null;
  }
}

export function hasVerifiedMfaFactor(user: User): boolean {
  return (user.factors ?? []).some(
    (factor) =>
      factor.status === "verified" && factor.factor_type === "totp",
  );
}

export function evaluateSessionAssurance(
  user: User,
  session: Session,
): SessionAssurance {
  const currentLevel = accessTokenAssuranceLevel(session.access_token);
  const hasVerifiedFactor = hasVerifiedMfaFactor(user);

  return {
    currentLevel,
    hasVerifiedFactor,
    requiresChallenge: hasVerifiedFactor && currentLevel !== "aal2",
  };
}

/**
 * The account identity must be validated with auth.getUser() before this helper
 * is called. getSession() is used only to read the signed access token's AAL
 * claim after that server-side identity validation.
 */
export async function getValidatedSessionAssurance(
  supabase: SupabaseServerClient,
  user: User,
): Promise<SessionAssurance> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    throw new SessionAssuranceError(
      error?.message || "The authenticated session is unavailable.",
    );
  }

  return evaluateSessionAssurance(user, session);
}
