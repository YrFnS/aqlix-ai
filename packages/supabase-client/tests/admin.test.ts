import { describe, test, expect, beforeEach } from "bun:test";
import { createAdminClient } from "../src/admin";

describe("Admin Client", () => {
  beforeEach(() => {
    process.env.SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_ANON_KEY = "test-anon-key";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
  });

  test("should create admin client instance", () => {
    const client = createAdminClient();
    expect(client).toBeDefined();
    expect(typeof client.from).toBe("function");
    expect(typeof client.auth.admin.deleteUser).toBe("function");
  });

  test("should create instances with service role key", () => {
    const client = createAdminClient();
    // Admin client should have admin auth methods
    expect(client.auth.admin).toBeDefined();
  });
});
