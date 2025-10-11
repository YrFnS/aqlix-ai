import { describe, test, expect, beforeEach } from "bun:test";
import {
  getBrowserEnv,
  getServerEnv,
  getAdminEnv,
  SupabaseEnvError,
} from "../src/env";

describe("Environment Validation", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset environment before each test
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });

  describe("getBrowserEnv", () => {
    test("should return valid browser environment", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

      const env = getBrowserEnv();
      expect(env.url).toBe("https://test.supabase.co");
      expect(env.anonKey).toBe("test-anon-key");
    });

    test("should throw error when URL is missing", () => {
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

      expect(() => getBrowserEnv()).toThrow(SupabaseEnvError);
    });

    test("should throw error when anon key is missing", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";

      expect(() => getBrowserEnv()).toThrow(SupabaseEnvError);
    });
  });

  describe("getServerEnv", () => {
    test("should return valid server environment", () => {
      process.env.SUPABASE_URL = "https://test.supabase.co";
      process.env.SUPABASE_ANON_KEY = "test-anon-key";
      process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";

      const env = getServerEnv();
      expect(env.url).toBe("https://test.supabase.co");
      expect(env.anonKey).toBe("test-anon-key");
      expect(env.serviceRoleKey).toBe("test-service-key");
    });

    test("should fallback to NEXT_PUBLIC_ variables", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

      const env = getServerEnv();
      expect(env.url).toBe("https://test.supabase.co");
      expect(env.anonKey).toBe("test-anon-key");
    });
  });

  describe("getAdminEnv", () => {
    test("should return valid admin environment", () => {
      process.env.SUPABASE_URL = "https://test.supabase.co";
      process.env.SUPABASE_ANON_KEY = "test-anon-key";
      process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";

      const env = getAdminEnv();
      expect(env.serviceRoleKey).toBe("test-service-key");
    });

    test("should throw error when service role key is missing", () => {
      process.env.SUPABASE_URL = "https://test.supabase.co";
      process.env.SUPABASE_ANON_KEY = "test-anon-key";

      expect(() => getAdminEnv()).toThrow(SupabaseEnvError);
    });
  });
});
