/**
 * Auth token generation utilities for testing
 * Provides test authentication tokens and session management
 */

import { createClient } from "@supabase/supabase-js";

/**
 * Test user credentials
 */
export interface TestUserCredentials {
  email: string;
  password: string;
  userId?: string;
  role?: "user" | "admin" | "professional";
}

/**
 * Test auth session
 */
export interface TestAuthSession {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Generates a test authentication token for a user
 *
 * @param credentials - Test user credentials
 * @param autoCreate - Whether to auto-create user if not exists (default: false)
 *
 * @example
 * ```typescript
 * // Sign in to existing test user
 * const token = await generateTestToken({
 *   email: "test@example.com",
 *   password: "testpass123"
 * });
 *
 * // Create user if needed (explicit opt-in)
 * const token = await generateTestToken({
 *   email: "test@example.com",
 *   password: "testpass123"
 * }, true);
 *
 * // Use token in authenticated requests
 * fetch("/api/protected", {
 *   headers: { Authorization: `Bearer ${token}` }
 * });
 * ```
 */
export async function generateTestToken(
  credentials: TestUserCredentials,
  autoCreate: boolean = false,
): Promise<string> {
  const supabaseUrl = process.env.SUPABASE_TEST_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_TEST_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase credentials not found. Set SUPABASE_TEST_URL and SUPABASE_TEST_ANON_KEY (or SUPABASE_URL and SUPABASE_ANON_KEY).",
    );
  }

  const client = createClient(supabaseUrl, supabaseKey);

  // Try to sign in with existing user
  const { data, error } = await client.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    // Only create user if explicitly requested
    if (!autoCreate) {
      throw new Error(
        `Test user does not exist. Set autoCreate=true to create user, or pre-create test users to avoid database pollution. Error: ${error.message}`,
      );
    }

    // Auto-create user (requires explicit opt-in)
    const { data: signUpData, error: signUpError } = await client.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });

    if (signUpError) {
      throw new Error(`Failed to create test user: ${signUpError.message}`);
    }

    if (!signUpData.session) {
      throw new Error("Failed to create session for test user");
    }

    return signUpData.session.access_token;
  }

  if (!data.session) {
    throw new Error("Failed to create session for test user");
  }

  return data.session.access_token;
}

/**
 * Generates a complete test auth session
 */
export async function generateTestSession(
  credentials: TestUserCredentials,
): Promise<TestAuthSession> {
  const supabaseUrl = process.env.SUPABASE_TEST_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_TEST_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase credentials not found");
  }

  const client = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await client.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error || !data.session) {
    throw new Error(`Failed to generate test session: ${error?.message}`);
  }

  // Validate user email exists
  if (!data.user?.email) {
    throw new Error(
      "User email required for token generation but was not returned by Supabase",
    );
  }

  return {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    user: {
      id: data.user.id,
      email: data.user.email,
      role: credentials.role || "user",
    },
  };
}

/**
 * Generates a mock JWT token for testing (no Supabase required)
 * Useful for testing without actual database connections
 */
export function generateMockToken(userId: string = "test-user-id"): string {
  // Simple base64-encoded JWT structure for testing
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: userId,
    email: "test@example.com",
    role: "user",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
  };

  // Use Buffer.from for Node.js compatibility (btoa is browser-only)
  const base64Header = Buffer.from(JSON.stringify(header)).toString("base64");
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");

  // Note: This is a mock signature, not cryptographically valid
  const mockSignature = "mock-signature-for-testing";

  return `${base64Header}.${base64Payload}.${mockSignature}`;
}

/**
 * Creates test credentials for Iraqi professional user
 */
export function createIraqiProfessionalCredentials(
  domain:
    | "legal"
    | "medical"
    | "educational"
    | "engineering"
    | "organizational",
): TestUserCredentials {
  return {
    email: `test.${domain}@iraqi-ai-test.com`,
    password: "TestPass123!",
    role: "professional",
  };
}
